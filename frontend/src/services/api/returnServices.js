import { supabase } from "../supabaseClient";

// Submit a new return request
export const createReturnRequest = async (
    orderId,
    bookId,
    quantity,
    itemPrice,
    reason,
    otherReason
  ) => {
    try {
      const { data, error } = await supabase.from("returns").insert([
        {
          order_id: orderId,
          book_id: bookId,
          quantity: quantity,
          item_price: itemPrice,
          reason: reason,
          other_reason: otherReason || null,
          return_status: "requested",
          request_date: new Date(), // Automatically sets current date
        },
      ]);
  
      if (error) throw error;
  
      return { success: true, data };
    } catch (err) {
      console.error("Error creating return request:", err.message);
      return { success: false, error: err.message };
    }
  };
  
  // Fetch return history for a specific order with book details
  export const getReturnHistoryByOrder = async (orderId) => {
    try {
      const { data, error } = await supabase
        .from("returns")
        .select(
          `
          book_id,
          quantity,
          item_price,
          reason,
          other_reason,
          return_status,
          request_date,
          books (
            title,
            image_url
          )
        `
        )
        .eq("order_id", orderId);
  
      if (error) throw error;
  
      return { data, error: null };
    } catch (err) {
      console.error("Error fetching return history:", err.message);
      return { data: null, error: err.message };
    }
  };
  
  