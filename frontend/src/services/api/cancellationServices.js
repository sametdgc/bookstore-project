import { supabase } from "../supabaseClient";

export const getPendingCancellations = async () => {
    try {
      const { data, error } = await supabase
        .from("cancellations")
        .select(`
          *,
          books (title, image_url),
          orders (order_id)
        `)
        .eq("status", "pending");
  
      if (error) throw error;
  
      return { success: true, data };
    } catch (err) {
      console.error("Error fetching pending cancellations:", err.message);
      return { success: false, error: err.message };
    }
  };
  
  // Approve a cancellation request
  export const approveCancellation = async (cancellationId, orderId) => {
    try {
      const { error } = await supabase
        .from("cancellations")
        .update({ status: "approved" })
        .eq("cancellation_id", cancellationId);
  
      if (error) throw error;
  
      // Update delivery status to "cancelled"
      const { error: deliveryError } = await supabase
        .from("deliverystatuses")
        .update({ status: "cancelled" })
        .eq("order_id", orderId);
  
      if (deliveryError) throw deliveryError;
  
      return { success: true };
    } catch (err) {
      console.error("Error approving cancellation:", err.message);
      return { success: false, error: err.message };
    }
  };
  
  // Reject a cancellation request
  export const rejectCancellation = async (cancellationId) => {
    try {
      const { error } = await supabase
        .from("cancellations")
        .update({ status: "rejected" })
        .eq("cancellation_id", cancellationId);
  
      if (error) throw error;
  
      return { success: true };
    } catch (err) {
      console.error("Error rejecting cancellation:", err.message);
      return { success: false, error: err.message };
    }
  };

  export const createCancellationRequest = async (
    orderId,
    bookId,
    quantity,
    reason,
    otherReason
  ) => {
    try {
      const { data, error } = await supabase.from("cancellations").insert([
        {
          order_id: orderId,
          book_id: bookId,
          quantity,
          reason,
          other_reason: otherReason || null,
          status: "pending", // Initial status
          request_date: new Date(), // Automatically sets current date
        },
      ]);
  
      if (error) throw error;
  
      return { success: true, data };
    } catch (err) {
      console.error("Error creating cancellation request:", err.message);
      return { success: false, error: err.message };
    }
  };


  export const getCancellationRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("cancellations")
        .select(`
          cancellation_id,
          order_id,
          book_id,
          quantity,
          reason,
          other_reason,
          status,
          request_date,
          books (title, image_url),
          orders!inner (
            user_id,
            users (full_name, email)
          )
        `)
        .order("request_date", { ascending: false });
  
      if (error) throw error;
  
      return { success: true, data };
    } catch (err) {
      console.error("Error fetching cancellation requests:", err.message);
      return { success: false, error: err.message };
    }
  };