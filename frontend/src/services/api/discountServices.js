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
  
      //3 notify the user that the discount was applied successfully
      await notifyUserAboutDiscount(bookId, discountName, discountRate, endDate);

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
  
const notifyUserAboutDiscount = async (bookId, discountName, discountRate, endDate) => {
    try {
      // Fetch the book details
      const { data: bookData, error: bookError } = await supabase
        .from("books")
        .select(
          `
          title,
          author:authors (author_name)
        `
        )
        .eq("book_id", bookId)
        .single();
  
      if (bookError) {
        console.error("Error fetching book details:", bookError.message);
        return;
      }
  
      const { title: bookTitle, author: { author_name: author } } = bookData;
  
      // Fetch user emails who have the book in their wishlist
      const { data: userEmails, error: emailError } = await supabase
        .from("wishlist")
        .select(`
          user:users (email)
        `)
        .eq("book_id", bookId);
  
      if (emailError) {
        console.error("Error fetching user emails:", emailError.message);
        return;
      }
  
      if (!userEmails || userEmails.length === 0) {
        console.log("No users found with the book in their wishlist.");
        return;
      }
  
      console.log("User emails:", userEmails);
  
      // Send discount emails asynchronously
      const emailPromises = userEmails.map(({ user }) =>
        sendDiscountEmail(user.email, bookTitle, author, discountName, discountRate, endDate)
      );
  
      await Promise.all(emailPromises);
  
      console.log("Discount emails sent successfully!");
    } catch (error) {
      console.error("Error notifying users about discount:", error.message);
    }
  };
  
const sendDiscountEmail = async (userEmail, bookTitle, author, discountName, discountRate, endDate) => {   
  try {
      const response = await fetch("http://localhost:5000/api/send-discount-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          booktitle: bookTitle,
          author,
          discountName,
          discountRate,
          endDate,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Failed to send email to ${userEmail}:`, errorData.error);
        return;
      }
  
      const result = await response.json();
      console.log(`Discount email sent to ${userEmail}:`, result);
    } catch (error) {
      console.error(`Error sending email to ${userEmail}:`, error.message);
    }
  };
  