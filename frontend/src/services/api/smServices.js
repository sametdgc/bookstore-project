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

// Fetch daily revenue for all days in ascending order
export const getDailyRevenue = async () => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("order_date, total_price")
      .order("order_date", { ascending: true });

    if (error) {
      console.error("Error fetching orders:", error.message);
      return [];
    }

    // Group and sum revenue by day
    const revenueByDate = data.reduce((acc, order) => {
      const date = new Date(order.order_date).toISOString().split("T")[0]; // Format: YYYY-MM-DD
      acc[date] = (acc[date] || 0) + order.total_price;
      return acc;
    }, {});

    // Convert to an array of { date, revenue }
    const formattedData = Object.keys(revenueByDate).map((date) => ({
      date,
      revenue: parseFloat(revenueByDate[date].toFixed(2)), // Fix to 2 decimal places
    }));

    return formattedData;
  } catch (error) {
    console.error("Unexpected error fetching daily revenue:", error.message);
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
