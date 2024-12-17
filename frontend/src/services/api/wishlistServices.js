import { supabase } from "../supabaseClient";


// ADD a book to the wishlist
export const addBookToWishlist = async (userId, bookId) => {
  const { data, error } = await supabase
    .from("wishlist")
    .insert([{ user_id: userId, book_id: bookId }]);
  if (error) {
    console.log("Error adding book to wishlist:", error.message);
    return null;
  }
  return data;
};

// GET the wishlist of a user (with enriched book details)
export const getWishlistByUserId = async (userId) => {
  const { data, error } = await supabase
    .from("wishlist")
    .select("*")
    .eq("user_id", userId);

  if (error && error.code !== "PGRST116") {
    console.log("Error fetching wishlist:", error.message);
    return [];
  }

  // Enrich the wishlist items with book details
  const enrichedWishlist = await Promise.all(
    data.map(async (item) => {
      const { data: bookDetails, error: bookError } = await supabase
        .from("books")
        .select("title, image_url")
        .eq("book_id", item.book_id)
        .single();

      if (bookError) {
        console.log(
          `Error fetching book details for book_id ${item.book_id}:`,
          bookError.message
        );
        return { ...item, title: "Unknown Title", image_url: null }; // Fallback
      }

      return { ...item, ...bookDetails }; // Merge book details into the wishlist item
    })
  );

  return enrichedWishlist;
};

// REMOVE a book from the wishlist
export const removeBookFromWishlist = async (userId, bookId) => {
  const { data, error } = await supabase
    .from("wishlist")
    .delete()
    .eq("user_id", userId)
    .eq("book_id", bookId);
  if (error) {
    console.log("Error removing book from wishlist:", error.message);
    return null;
  }
  return data;
};

// Helper: Get items from localStorage-based wishlist
export const getLocalWishlistItems = () => {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
};

// Helper: Add a book to the local wishlist
export const addItemToLocalWishlist = (book) => {
  const wishlist = getLocalWishlistItems();
  if (!wishlist.find((item) => item.book_id === book.book_id)) {
    wishlist.push(book);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }
};

// Helper: Remove a book from the local wishlist
export const removeItemFromLocalWishlist = (bookId) => {
  const wishlist = getLocalWishlistItems();
  const updatedWishlist = wishlist.filter((item) => item.book_id !== bookId);
  localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  return updatedWishlist;
};

// SYNC local wishlist to database
export const syncLocalWishlistToDatabase = async (localWishlist, userId) => {
  try {
    // Fetch the user's existing wishlist from the database
    const dbWishlist = await getWishlistByUserId(userId);

    // Create a set of book IDs already in the database wishlist
    const dbWishlistBookIds = new Set(dbWishlist.map((item) => item.book_id));

    // Iterate through the local wishlist
    for (const localItem of localWishlist) {
      if (!dbWishlistBookIds.has(localItem.book_id)) {
        // Only add to the database if it doesn't already exist
        const { error } = await supabase
          .from("wishlist")
          .insert([{ user_id: userId, book_id: localItem.book_id }]);

        if (error) {
          console.error(
            `Error adding book with ID ${localItem.book_id}: ${error.message}`
          );
        }
      } else {
        console.log(
          `Book with ID ${localItem.book_id} is already in the wishlist. Skipping...`
        );
      }
    }

    // Clear the local wishlist
    localStorage.removeItem("wishlist");
  } catch (error) {
    console.error("Error syncing wishlist to database:", error);
  }
};