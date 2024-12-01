import { supabase } from "./supabaseClient";

// Fetch all genres
export const getGenres = async () => {
  const { data, error } = await supabase.from("genres").select("*");
  if (error) {
    console.log("Error fetching genres:", error.message);
    return [];
  }
  return data;
};

//Fetch all languages
export const getLanguages = async () => {
  const { data, error } = await supabase.from("languages").select("*");
  if (error) {
    console.log("Error fetching languages:", error.message);
    return [];
  }
  return data;
};

//Fetch all authors
export const getAuthors = async () => {
  const { data, error } = await supabase.from("authors").select("*");
  if (error) {
    console.log("Error fetching authors:", error.message);
    return [];
  }
  return data;
};

// GET all books with pagination
export const getAllBooks = async (limit, offset) => {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .range(offset, offset + limit - 1);

  if (error) {
    console.log("Error fetching books:", error.message);
  }

  return data;
};

// GET a book with genre, author, language, and reviews
export const getBookDetailsById = async (bookId) => {
  const { data, error } = await supabase
    .from("books")
    .select(
      `
      *,
      author:authors (author_name),
      genre:genres (genre_name),
      language:languages (language_name),
      reviews:reviews (
        review_id,
        user:user_id (full_name),
        rating,
        comment,
        approval_status
      )
    `
    )
    .eq("book_id", bookId)
    .single();

  if (error) {
    console.log("Error fetching book details:", error.message);
    return null;
  }

  // Filter only approved reviews
  if (data.reviews) {
    data.reviews = data.reviews.filter(
      (review) => review.approval_status === true
    );
  }

  return data;
};

// GET books by ids, works for a set of book ids
export const getBookById = async (bookIds) => {
  const { data, error } = await supabase
    .from("books")
    .select(
      `
      *,
      author:authors (author_name),
      genre:genres (genre_name),
      language:languages (language_name),
      reviews:reviews (
        review_id,
        user:user_id (full_name),
        rating,
        comment,
        approval_status
      )
    `
    )
    .in("book_id", bookIds);
  if (error) {
    console.log("Error fetching books by ID:", error.message);
  }
  return data;
};


// PLACE an order
export const placeOrder = async (order) => {
  const { data, error } = await supabase.from("orders").insert([order]);
  if (error) console.log("Error placing order:", error.message);
  return data;
};


export const searchBooks = async (query) => {
  // Query for books by title or ISBN
  const { data: booksByTitleOrIsbnOrDescorPub, error: mainError } = await supabase
    .from("books")
    .select(
      `
      *,
      author:authors (author_name) -- Join the authors table to get author_name
    `
    )
    .or(`title.ilike.%${query}%,isbn.ilike.%${query}%,description.ilike.%${query}%,publisher.ilike.%${query}%`); // Search in title, ISBN, or description

  if (mainError) {
    console.log("Error fetching books by title or ISBN:", mainError.message);
    return [];
  }

  // Query for books by author name
  const { data: booksByAuthor, error: authorError } = await supabase
    .from("books")
    .select(
      `
      *,
      author:authors (author_name) -- Join the authors table to get author_name
    `
    )
    .ilike("author.author_name", `%${query}%`); // Search in related author table

  if (authorError) {
    console.log("Error fetching books by author:", authorError.message);
    return booksByTitleOrIsbnOrDescorPub; // Return partial results if author query fails
  }

  // Combine and deduplicate results
  const combinedResults = [
    ...booksByTitleOrIsbnOrDescorPub,
    ...booksByAuthor.filter(
      (bookByAuthor) =>
        !booksByTitleOrIsbnOrDescorPub.some((book) => book.book_id === bookByAuthor.book_id)
    ),
  ];

  // Remove books without authors
  const filteredResults = combinedResults.filter((book) => book.author);

  return filteredResults;
};

// GET a books by genre
export const getBooksByGenre = async (genreId) => {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("genre_id", genreId);

  if (error) {
    console.log("Error fetching books by genre:", error.message);
    return [];
  }

  return data;
};

// GET genre id by name
export const getGenreIdByName = async (genreName) => {
  const { data, error } = await supabase
    .from("genres")
    .select("genre_id")
    .ilike("genre_name", `%${genreName}%`)
    .single();

  if (error) {
    console.log("Error fetching genre ID:", error.message);
    return null;
  }

  return data.genre_id;
};

/* 

  AUTHENTICATION SERVICES

*/

// Fetch the current user
export const fetchUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

// Listen for authentication state changes
export const onAuthStateChange = (callback) => {
  const { data: authListener } = supabase.auth.onAuthStateChange(
    (event, session) => {
      callback(session?.user || null);
    }
  );
  return authListener;
};

// Sign out the user
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error signing out:", error.message);
  }
  return error;
};

//test wheter you are connected to the api or not
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Error connecting to Supabase:", error);
    } else {
      console.log("Connection successful:", data);
    }
  } catch (err) {
    console.error("Unexpected error:", err);
  }
};

// GET all user data
export const getUserData = async () => {
  try {
    // Get the current session
    const user = await fetchUser();
    // Extract the user_id from the session metadata
    const userId = user.user_metadata.custom_incremented_id;
    // Query the users table with the user_id
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (error) {
      console.error("Error fetching user data:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.error("Error in getUserData function:", err);
    return null;
  }
};

// UPDATE user data
export const updateUserData = async (updatedData) => {
  const { full_name, phone_number, tax_id } = updatedData;

  try {
    const user = await fetchUser();
    if (!user) {
      throw new Error("User is not logged in.");
    }

    const userId = user.user_metadata.custom_incremented_id;

    const { data, error } = await supabase
      .from("users")
      .update({ full_name, phone_number, tax_id })
      .eq("user_id", userId);

    if (error) {
      throw new Error("Error updating user data: " + error.message);
    }

    return data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

/*
 export const getUserData = async () => {
  try {
    // Fetch the current user
    const user = await fetchUser();

    // Use the email field from the authenticated user object
    const userEmail = user?.email;

    if (!userEmail) {
      console.error('User email is undefined or null. Check authentication.');
      return null; // Return early if the email is invalid
    }

    // Query the 'users' table with the user email
    const { data, error } = await supabase
      .from('users') // Ensure this table exists in your database
      .select('*')   // Select all fields (or specify the fields you need)
      .eq('email', userEmail) // Use 'email' as the filter field
      .single(); // Expect a single record for the given email

    if (error) {
      console.error('Error fetching user data:', error.message);
      return null; // Return null if the query fails
    }

    return data; // Return the fetched user data
  } catch (err) {
    console.error('Error in getUserData function:', err);
    return null; // Return null if there's an unexpected error
  }
};
*/
// GET user addresses
export const getUserAddresses = async () => {
  try {
    const user = await fetchUser();
    if (!user) return null;

    const userId = user.user_metadata.custom_incremented_id;

    const { data, error } = await supabase
      .from("useraddresses")
      .select(
        `
        address_id,
        address_title,
        address:addresses (
          city,
          district,
          address_details,
          zip_code
        )
      `
      )
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching user addresses:", error.message);
      return [];
    }

    return data;
  } catch (err) {
    console.error("Error in getUserAddresses function:", err);
    return [];
  }
};

// ADD a new address for a user
export const addNewAddress = async (userId, addressData) => {
  try {
    const { data: newAddress, error: addressError } = await supabase
      .from("addresses")
      .insert([
        {
          city: addressData.city,
          district: addressData.district,
          address_details: addressData.address_details,
          zip_code: addressData.zip_code, // Add zip_code
        },
      ])
      .select()
      .single();

    if (addressError)
      throw new Error("Error adding address: " + addressError.message);

    const { error: userAddressError } = await supabase
      .from("useraddresses")
      .insert([
        {
          user_id: userId,
          address_id: newAddress.address_id,
          address_title: addressData.address_title,
        },
      ]);

    if (userAddressError)
      throw new Error(
        "Error linking address to user: " + userAddressError.message
      );

    return { success: true, newAddress };
  } catch (error) {
    console.error(error.message);
    return { success: false, error: error.message };
  }
};

// UPDATE an existing address for a user
export const updateAddressDetails = async (
  userId,
  addressId,
  updatedAddressData
) => {
  try {
    // Update the `addresses` table with the new details (city, district, address_details, zip_code)
    const { error: addressError } = await supabase
      .from("addresses")
      .update({
        city: updatedAddressData.city,
        district: updatedAddressData.district,
        address_details: updatedAddressData.address_details,
        zip_code: updatedAddressData.zip_code, // Update zip_code
      })
      .eq("address_id", addressId); // Match the address_id

    if (addressError) {
      throw new Error(
        "Error updating address details: " + addressError.message
      );
    }

    // Update the `address_title` in the `useraddresses` table if provided
    const { error: userAddressError } = await supabase
      .from("useraddresses")
      .update({
        address_title: updatedAddressData.address_title,
      })
      .eq("user_id", userId) // Match the user_id
      .eq("address_id", addressId); // Match the address_id

    if (userAddressError) {
      throw new Error(
        "Error updating address title: " + userAddressError.message
      );
    }

    return { success: true };
  } catch (error) {
    console.error(error.message);
    return { success: false, error: error.message };
  }
};

// DELETE an address for a user
export const deleteAddress = async (addressId) => {
  try {
    // Delete the address from the `addresses` table
    const { error } = await supabase
      .from("addresses")
      .delete()
      .eq("address_id", addressId);

    if (error) {
      throw new Error("Error deleting address: " + error.message);
    }

    // Return success
    return { success: true };
  } catch (error) {
    console.error(error.message);
    return { success: false, error: error.message };
  }
};

// GET user orders (including order items)
export const getUserOrders = async () => {
  try {
    const user = await fetchUser();
    if (!user) return null;

    const userId = user.user_metadata.custom_incremented_id;

    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        order_id,
        order_date,
        total_price,
        address:addresses (
          city,
          district,
          address_details,
          zip_code
        ),
        order_items:orderitems (
          book_id,
          quantity,
          item_price,
          book:books (
            title,
            image_url
          )
        )
      `
      )
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching user orders:", error.message);
      return [];
    }

    return data;
  } catch (err) {
    console.error("Error in getUserOrders function:", err);
    return [];
  }
};

/*

  CART SERVICES

*/

// Ensure a cart exists for a user, create it if not
export const getOrCreateCartByUserId = async (userId) => {
  // First, check if the cart exists
  const { data: cart, error } = await supabase
    .from("cart")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    // PGRST116: No rows returned
    console.log("Error fetching cart:", error.message);
    return null;
  }

  // If the cart exists, return it
  if (cart) {
    return cart;
  }

  // If the cart doesn't exist, create a new one
  const { data: newCart, error: insertError } = await supabase
    .from("cart")
    .insert([{ user_id: userId }])
    .single();

  if (insertError) {
    console.log("Error creating cart:", insertError.message);
    return null;
  }

  return newCart;
};

// Add an item to the cart, ensuring the cart exists
export const addItemToCart = async (userId, bookId, quantity, price) => {
  // Ensure the cart exists or create one
  const cart = await getOrCreateCartByUserId(userId);

  if (!cart) {
    console.log("Unable to find or create cart for user:", userId);
    return null;
  }

  const cartId = cart.cart_id;

  // Check if the item already exists in the cart
  const { data: existingItem, error: existingError } = await supabase
    .from("cartitems")
    .select("*")
    .eq("cart_id", cartId)
    .eq("book_id", bookId)
    .maybeSingle();

  if (existingError && existingError.code !== "PGRST116") {
    console.log("Error checking cart item:", existingError.message);
    return null;
  }

  if (existingItem) {
    // If the item exists, update its quantity
    const newQuantity = existingItem.quantity + quantity;
    return await updateCartItemQuantity(cartId, bookId, newQuantity);
  }

  // If the item doesn't exist, insert it
  const { data, error } = await supabase
    .from("cartitems")
    .insert([{ cart_id: cartId, book_id: bookId, quantity, price }]);

  if (error) {
    console.log("Error adding item to cart:", error.message);
    return null;
  }

  return data;
};

export const updateCartItemQuantity = async (cartId, bookId, quantity) => {
  const { data, error } = await supabase
    .from("cartitems")
    .update({ quantity })
    .eq("cart_id", cartId)
    .eq("book_id", bookId);

  if (error) {
    console.log("Error updating cart item:", error.message);
    return null;
  }

  return data;
};

// Get all items in a user's cart
export const getCartItems = async (userId) => {
  // Ensure the cart exists
  const cart = await getOrCreateCartByUserId(userId);

  if (!cart) {
    console.log("No cart found for user:", userId);
    return [];
  }

  const { data, error } = await supabase
    .from("cartitems")
    .select(
      `
      *,
      book:books (
        title,
        image_url,
        price
      )
    `
    )
    .eq("cart_id", cart.cart_id);

  if (error && error.code !== "PGRST116") {
    console.log("Error fetching cart items:", error.message);
    return [];
  }

  return data;
};

// Remove an item from the cart
export const removeCartItem = async (cartId, bookId) => {
  const { data, error } = await supabase
    .from("cartitems")
    .delete()
    .eq("cart_id", cartId)
    .eq("book_id", bookId);

  if (error) {
    console.log("Error removing cart item:", error.message);
    return null;
  }

  return data;
};

// Helper function to get items from localStorage-based cart
export const getLocalCartItems = () => {
  return JSON.parse(localStorage.getItem("cart")) || [];
};

// Update quantity of an item in localStorage-based cart
export const updateLocalCartItemQuantity = (bookId, newQuantity) => {
  const cart = getLocalCartItems();

  // Update the quantity or remove the item if quantity <= 0
  const updatedCart = cart
    .map((item) =>
      item.book_id === bookId ? { ...item, quantity: newQuantity } : item
    )
    .filter((item) => item.quantity > 0);

  localStorage.setItem("cart", JSON.stringify(updatedCart));
  return updatedCart;
};

// Add item to localStorage-based cart for anonymous users
export const addItemToLocalCart = (bookId, quantity, price) => {
  const cart = getLocalCartItems();
  const existingItem = cart.find((item) => item.book_id === bookId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ book_id: bookId, quantity, price });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
};

// Remove an item from localStorage-based cart
export const removeItemFromLocalCart = (bookId) => {
  const cart = getLocalCartItems();
  const updatedCart = cart.filter((item) => item.book_id !== bookId);

  localStorage.setItem("cart", JSON.stringify(updatedCart));

  console.log(`Removed item with bookId ${bookId} from local cart.`);
  console.log("Updated local cart:", updatedCart);

  return updatedCart;
};

export const syncLocalCartToDatabase = async (localCart, userId) => {
  try {
    // Fetch or create the user's database cart
    const userCart = await getOrCreateCartByUserId(userId);
    const cartId = userCart.cart_id;
    const userCartItems = await getCartItems(userId);

    // Create a map of existing database cart items by book_id
    const userCartMap = {};
    userCartItems.forEach((item) => {
      userCartMap[item.book_id] = item; // { book_id: item }
    });

    for (const localItem of localCart) {
      const { book_id, quantity, price } = localItem;

      // Check if the book exists in the user's database cart
      const { data: existingCartItem, error: cartError } = await supabase
        .from("cartitems")
        .select("*")
        .eq("cart_id", cartId)
        .eq("book_id", book_id)
        .maybeSingle(); // Avoids throwing an error for non-existent rows

      if (cartError && cartError.code !== "PGRST116") {
        console.error(
          `Error checking book with ID ${book_id}:`,
          cartError.message
        );
        continue; // Skip to the next item
      }

      if (!existingCartItem) {
        // No rows returned, meaning the book is not yet in the user's cart
        console.log(
          `Book with ID ${book_id} is not in the user's cart. Adding...`
        );
        await addItemToCart(userId, book_id, quantity, price);
      } else {
        // If the book exists, update its quantity
        const updatedQuantity = existingCartItem.quantity + quantity;
        await updateCartItemQuantity(cartId, book_id, updatedQuantity);
      }
    }

    // Clear the localStorage cart
    localStorage.removeItem("cart");

    return await getCartItems(userId);
  } catch (error) {
    console.error("Error syncing local cart to database:", error);
    return [];
  }
};

/* 

  WISHLIST SERVICES

*/

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


// Get role of a user by user_id
// Fetch the role of a user by their user ID
export const getUserRoleById = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('role_id, role:roles(role_name)')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user role:', error.message);
      return null;
    }

    return data.role;
  } catch (err) {
    console.error('Unexpected error fetching user role:', err);
    return null;
  }
};

// Fetch reviews for a book
export const getReviewsForBook = async (bookId) => {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select(
        `
        *,
        user:users (full_name)
      `
      )
      .eq("book_id", bookId);

    if (error) {
      console.error("Error fetching reviews:", error.message);
      return [];
    }

    return data;
  } catch (err) {
    console.error("Unexpected error fetching reviews:", err);
    return [];
  }
};

// Submit a new review
export const submitReview = async (review) => {
  try {
    const { error } = await supabase.from("reviews").insert([review]);

    if (error) {
      console.error("Error submitting review:", error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Unexpected error submitting review:", err);
    return false;
  }
};

// Approve a review
export const approveReview = async (reviewId) => {
  try {
    const { error } = await supabase
      .from("reviews")
      .update({ approval_status: true })
      .eq("review_id", reviewId);

    if (error) {
      console.error("Error approving review:", error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Unexpected error approving review:", err);
    return false;
  }
};

// Fetch pending reviews for a book
export const getPendingReviewsForBook = async (bookId) => {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("book_id", bookId)
      .eq("approval_status", false);

    if (error) {
      console.error("Error fetching pending reviews:", error.message);
      return [];
    }

    return data;
  } catch (err) {
    console.error("Unexpected error fetching pending reviews:", err);
    return [];
  }
};


// Disapprove a review
export const disapproveReview = async (reviewId) => {
  const { data, error } = await supabase
    .from('reviews')
    .delete()
    .eq('review_id', reviewId);

  if (error) {
    console.error('Error disapproving review:', error.message);
    return null;
  }

  return data;
};

// Fetch all pending reviews for PM approval
export const getPendingReviews = async ({
  bookId = null,
  rating = null,
  searchQuery = '',
  sortBy = 'created_at',
  sortDirection = 'desc',
  limit = 10,
  offset = 0,
} = {}) => {
  let query = supabase
    .from('reviews')
    .select(
      `
      review_id,
      book_id,
      user_id,
      rating,
      comment,
      created_at,
      books (title, image_url),
      users (full_name)
      `
    )
    .eq('approval_status', false)
    .order(sortBy, { ascending: sortDirection === 'asc' })
    .range(offset, offset + limit - 1);

  if (bookId) {
    query = query.eq('book_id', bookId);
  }

  if (rating) {
    query = query.eq('rating', rating);
  }

  if (searchQuery) {
    query = query.or(
      `books.title.ilike.%${searchQuery}%,users.full_name.ilike.%${searchQuery}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching pending reviews:', error.message);
    return [];
  }

  return data;
};


/*

INVOICE SERVICES

*/

// Fetch order details by order ID
export const getOrderDetailsById = async (orderId) => {
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
            books (title)
          )
        `)
        .eq('order_id', orderId)
        .single();

      console.log(data);
    if (error) {
      console.error('Error fetching order details:', error.message);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { data: null, error: err };
  }
};

