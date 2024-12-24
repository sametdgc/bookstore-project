import { supabase } from "../supabaseClient";



/*   SALES MANAGER SERVICES  */

// fetc all invoices
export const getAllInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          order_id,
          order_date,
          total_price,
          users (
            full_name,
            email,
            phone_number
          ),
          addresses (
            city,
            district,
            address_details,
            zip_code
          ),
          orderitems (
            book_id,
            quantity,
            item_price,
            books (
              title,
              image_url
            )
          )
        `)
      if (error) {
        console.error('Error fetching invoices:', error.message);
        return [];
      }
  
      return data;
    } catch (err) {
      console.error('Unexpected error fetching invoices:', err);
      return [];
    }
  };

// get revenue amount for a category of books
export const getRevenueByCategory = async () => {
  try {
    const { data, error } = await supabase
      .from("orderitems")
      .select(
        `
          quantity,
          item_price,
          books:books (
            genre_id,
            genres:genres (genre_name)
          )
        `
      );

    if (error) {
      console.error("Error fetching revenue by category:", error.message);
      return [];
    }

    // Group revenue by genre
    const revenueByGenre = data.reduce((acc, item) => {
      const genreName = item.books?.genres?.genre_name || "Unknown";
      const totalItemRevenue = item.quantity * item.item_price;

      acc[genreName] = (acc[genreName] || 0) + totalItemRevenue;
      return acc;
    }, {});

    // Format data for the chart
    return Object.keys(revenueByGenre).map((genre) => ({
      category: genre,
      revenue: parseFloat(revenueByGenre[genre].toFixed(2)), // Ensure 2 decimal precision
    }));
  } catch (err) {
    console.error("Unexpected error fetching revenue by category:", err.message);
    return [];
  }
};


export const getTopCustomers = async () => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        total_price,
        user_id,
        users (full_name)
      `
      );

    if (error) {
      console.error("Error fetching top customers:", error.message);
      return [];
    }

    // Group total revenue by user
    const revenueByCustomer = data.reduce((acc, order) => {
      const customerName = order.users?.full_name || "Unknown";
      acc[customerName] = (acc[customerName] || 0) + order.total_price;
      return acc;
    }, {});

    // Format as array and sort by revenue (descending)
    const formattedData = Object.keys(revenueByCustomer)
      .map((customer) => ({
        name: customer,
        revenue: parseFloat(revenueByCustomer[customer].toFixed(2)), // 2 decimal precision
      }))
      .sort((a, b) => b.revenue - a.revenue); // Sort by revenue descending

    return formattedData;
  } catch (err) {
    console.error("Unexpected error fetching top customers:", err.message);
    return [];
  }
};

export const getBestSellingBooksComposition = async () => {
  try {
    const { data, error } = await supabase
      .from("orderitems")
      .select(
        `
        book_id,
        quantity,
        item_price,
        books (title)
      `
      );

    if (error) {
      console.error("Error fetching best-selling books:", error.message);
      return [];
    }

    // Aggregate total revenue for each book
    const revenueByBook = {};

    data.forEach((item) => {
      const bookTitle = item.books?.title || "Unknown Book";
      const revenue = item.quantity * item.item_price;

      // Accumulate revenue for each book
      revenueByBook[bookTitle] = (revenueByBook[bookTitle] || 0) + revenue;
    });

    // Format as an array and sort by revenue descending
    return Object.keys(revenueByBook)
      .map((title) => ({
        title,
        revenue: parseFloat(revenueByBook[title].toFixed(2)), // 2 decimal precision
      }))
      .sort((a, b) => b.revenue - a.revenue); // Sort by total revenue
  } catch (err) {
    console.error("Unexpected error fetching best-selling books:", err.message);
    return [];
  }
};

export const getDailyTotalRevenue = async (startDate = null, endDate = null) => {
  try {
    let query = supabase
      .from("orders")
      .select("order_date, total_price");

    // Apply date filters if provided
    if (startDate) {
      query = query.gte("order_date", startDate);
    }
    if (endDate) {
      query = query.lte("order_date", endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching daily revenue:", error.message);
      return [];
    }

    // Group and sum revenue by day
    const revenueByDay = {};

    data.forEach((order) => {
      const date = order.order_date.split("T")[0]; // Extract just the date part
      revenueByDay[date] = (revenueByDay[date] || 0) + order.total_price;
    });

    // Convert to array format for Recharts
    return Object.keys(revenueByDay)
      .map((date) => ({
        date,
        revenue: parseFloat(revenueByDay[date].toFixed(2)),
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date
  } catch (err) {
    console.error("Unexpected error fetching daily revenue:", err.message);
    return [];
  }
};

//claculates the total revenue so far, what it does is that it fetches all the orders and gorups the total price of orders in the same day
// and then sums them up, then each day gets the revenue of tat day and all the past days, so the last day will have the total revenue
//we just returned the given date range
export const getTotalRevenue = async (startDate = null, endDate = null) => {
  try {
    let query = supabase
      .from("orders")
      .select("order_date, total_price");

    if (startDate) query = query.gte("order_date", startDate);
    if (endDate) query = query.lte("order_date", endDate);

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching data:", error);
      throw error;
    }

    // Generate all dates in range
    const allDates = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      allDates.push(currentDate.toISOString().split("T")[0]); // Add date string
      currentDate.setDate(currentDate.getDate() + 1); // Increment day
    }

    // Group orders by date
    const revenueMap = {};
    data.forEach(({ order_date, total_price }) => {
      const date = order_date.split("T")[0];
      if (!revenueMap[date]) revenueMap[date] = 0;
      revenueMap[date] += parseFloat(total_price);
    });

    // Fill in missing dates with 0 revenue
    let cumulativeRevenue = 0;
    const result = allDates.map((date) => {
      const dailyRevenue = revenueMap[date] || 0;
      cumulativeRevenue += dailyRevenue;
      return { date, revenue: cumulativeRevenue };
    });

    return result;
  } catch (error) {
    console.error("Error calculating total revenue:", error);
    throw error;
  }
};

//update the price of a book with the given id
export const updateBookPrice = async (id, newPrice) => {
  try {
    const { error } = await supabase
      .from("books")
      .update({ price: newPrice })
      .eq("book_id", id);

    if (error) {
      console.error("Error updating book price:", error.message);
      return { error: error.message };
    }

    return { error: null };
  } catch (err) {
    console.error("Unexpected error updating book price:", err);
    return { error: err.message };
  }
};

//get all books from the database
export const getAllBooksRaw = async () => {
  try {
    const { data, error } = await supabase
    .from("books")
    .select(`
      *,
      author:authors (author_name),
      genre:genres (genre_name),
      language:languages (language_name)
    `);
    if (error) {
      console.error("Error fetching books:", error.message);
      return { data: [] };
    }
    return { data };
  } catch (err) {
    console.error("Unexpected error fetching books:", err);
    return { data: [] };
  }
};

// Fetch all refund requests
export const getRefundRequests = async () => {
  try {
    const { data, error } = await supabase
      .from("returns")
      .select(`
        id,
        order_id,
        book_id,
        quantity,
        item_price,
        reason,
        other_reason,
        return_status,
        request_date,
        books (title, stock),
        users (full_name, email)
      `)
      .order("request_date", { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (err) {
    console.error("Error fetching refund requests:", err.message);
    return { data: null, error: err.message };
  }
};

// Approve a refund request
export const approveRefund = async (refundId) => {
  try {
    // Get the return request details
    const { data: returnDetails, error: fetchError } = await supabase
      .from("returns")
      .select("book_id, quantity, item_price")
      .eq("id", refundId)
      .single();

    if (fetchError) throw fetchError;

    const { book_id, quantity, item_price } = returnDetails;

    // Update stock of the product
    const { error: stockError } = await supabase
      .from("books")
      .update({ stock: supabase.raw("stock + ?", [quantity]) })
      .eq("id", book_id);

    if (stockError) throw stockError;

    // Update the refund request to approved
    const { error: statusError } = await supabase
      .from("returns")
      .update({ return_status: "approved" })
      .eq("id", refundId);

    if (statusError) throw statusError;

    return { success: true };
  } catch (err) {
    console.error("Error approving refund:", err.message);
    return { success: false, error: err.message };
  }
};

// Reject a refund request
export const rejectRefund = async (refundId) => {
  try {
    const { error } = await supabase
      .from("returns")
      .update({ return_status: "rejected" })
      .eq("id", refundId);

    if (error) throw error;

    return { success: true };
  } catch (err) {
    console.error("Error rejecting refund:", err.message);
    return { success: false, error: err.message };
  }
};