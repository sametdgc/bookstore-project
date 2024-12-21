import { supabase } from "../supabaseClient";

export const applyDiscountToBook = async (bookId, discountName, discountRate, endDate = null) => {
    try {
      const currentDate = new Date().toISOString(); // Current date in ISO format
  
      // 1. Check for an existing discount
      const { data: existingDiscounts, error: fetchError } = await supabase
        .from("bookdiscounts")
        .select("discount_id")
        .eq("book_id", bookId);
  
      if (fetchError) {
        console.error("Error fetching existing discount:", fetchError.message);
        return { error: fetchError.message };
      }
  
      if (existingDiscounts.length > 0) {
        // End the current discount
        const { error: endError } = await supabase
          .from("discounts")
          .update({ end_date: currentDate })
          .eq("discount_id", existingDiscounts[0].discount_id);
  
        if (endError) {
          console.error("Error ending current discount:", endError.message);
          return { error: endError.message };
        }
      }
  
      // 2. Add the new discount with an optional end date
      const { data: newDiscount, error: insertError } = await supabase
        .from("discounts")
        .insert({
          discount_name: discountName,
          discount_rate: discountRate,
          start_date: currentDate,
          end_date: endDate ? new Date(endDate).toISOString() : null, // Convert endDate to ISO format if provided
        })
        .select()
        .single();
  
      if (insertError) {
        console.error("Error inserting new discount:", insertError.message);
        return { error: insertError.message };
      }
  
      // 3. Link the new discount to the book
      const { error: linkError } = await supabase
        .from("bookdiscounts")
        .insert({
          book_id: bookId,
          discount_id: newDiscount.discount_id,
        });
  
      if (linkError) {
        console.error("Error linking discount to book:", linkError.message);
        return { error: linkError.message };
      }
  
      return { error: null, message: "Discount applied successfully!" };
    } catch (err) {
      console.error("Unexpected error applying discount:", err);
      return { error: err.message };
    }
  };
  

export const getCurrentDiscount = async (bookId) => {
    try {
      // Fetch all discounts associated with the book
      const { data, error } = await supabase
        .from("bookdiscounts")
        .select(
          `
          discount_id,
          discounts (
            discount_name,
            discount_rate,
            start_date,
            end_date
          )
        `
        )
        .eq("book_id", bookId);
  
      if (error) {
        console.error("Error fetching discounts:", error.message);
        return { error: error.message };
      }
  
      if (!data || data.length === 0) {
        return { data: null }; // No discounts found
      }
  
      // Filter for active discounts (end_date is null or in the future)
      const currentDate = new Date().toISOString();
      const activeDiscounts = data
        .filter(
          (item) =>
            !item.discounts.end_date || item.discounts.end_date > currentDate
        )
        .map((item) => item.discounts);
  
      if (activeDiscounts.length === 0) {
        return { data: null }; // No active discounts
      }
  
      // Return the most recent active discount based on the start_date
      const mostRecentDiscount = activeDiscounts.reduce((latest, discount) =>
        new Date(discount.start_date) > new Date(latest.start_date)
          ? discount
          : latest
      );
  
      return { data: mostRecentDiscount };
    } catch (err) {
      console.error("Unexpected error fetching current discount:", err);
      return { error: err.message };
    }
  };
  
  export const endAllActiveDiscounts = async (bookId) => {
    const currentDate = new Date().toISOString();
  
    // Fetch all active discount IDs for the given book
    const { data: bookDiscounts, error } = await supabase
      .from("bookdiscounts")
      .select("discount_id")
      .eq("book_id", bookId);
  
    if (error) {
      console.error("Error fetching active discounts:", error.message);
      return { error: error.message };
    }
  
    if (bookDiscounts.length > 0) {
      // Extract discount IDs
      const discountIds = bookDiscounts.map((discount) => discount.discount_id);
  
      // Update all active discounts to set their end_date
      const { error: updateError } = await supabase
        .from("discounts")
        .update({ end_date: currentDate })
        .in("discount_id", discountIds);
  
      if (updateError) {
        console.error("Error ending active discounts:", updateError.message);
        return { error: updateError.message };
      }
    }
  
    return { error: null };
  };
  