import { supabase } from "../supabaseClient";

// Cancel an order
export const cancelOrder = async (orderId) => {
  try {
    // Update the order status to "canceled"
    const { data, error } = await supabase
      .from("orders")
      .update({ status: "canceled", canceled_date: new Date() }) // Add a "canceled_date" column if needed
      .eq("order_id", orderId);

    if (error) throw error;

    return { success: true, data };
  } catch (err) {
    console.error("Error canceling the order:", err.message);
    return { success: false, error: err.message };
  }
};

// Fetch order details by order ID (if not already implemented)
export const getOrderDetailsById = async (orderId) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        order_id,
        status,
        created_date,
        orderitems (
          book_id,
          quantity,
          item_price,
          books (
            title,
            image_url
          )
        )
      `
      )
      .eq("order_id", orderId)
      .single(); // Use .single() to fetch a single order

    if (error) throw error;

    return { data, error: null };
  } catch (err) {
    console.error("Error fetching order details:", err.message);
    return { data: null, error: err.message };
  }
};

// Update the stock of a book (if not already implemented)
export const updateBookStock = async (bookId, quantityToAdd) => {
  try {
    const { data, error } = await supabase
      .from("books")
      .update({
        stock: supabase.raw("stock + ?", [quantityToAdd]), // Increment stock by the quantityToAdd
      })
      .eq("book_id", bookId);

    if (error) throw error;

    return { success: true, data };
  } catch (err) {
    console.error("Error updating book stock:", err.message);
    return { success: false, error: err.message };
  }
};
