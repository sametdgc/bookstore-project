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

// GET books by id
export const getBookById = async (bookId) => {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("book_id", bookId)
    .single();
  if (error) console.log("Error fetching book:", error.message);
  return data;
};

// UPDATE a book
export const updateBook = async (bookId, updates) => {
  const { data, error } = await supabase
    .from("books")
    .update(updates)
    .eq("book_id", bookId);
  if (error) console.log("Error updating book:", error.message);
  return data;
};

// // GET cart of a user
// export const getCartByUserId = async (userId) => {
//   const { data, error } = await supabase
//       .from('Cart')
//       .select('*')
//       .eq('user_id', userId)
//       .single();
//   if (error) console.log('Error fetching cart:', error.message);
//   return data;
// };

// // ADD an item to the cart
// export const addItemToCart = async (cartId, cartItem) => {
//   const { data, error } = await supabase
//       .from('CartItems')
//       .insert([{ cart_id: cartId, ...cartItem }]);
//   if (error) console.log('Error adding item to cart:', error.message);
//   return data;
// };

// // UPDATE an item's quantity in the cart
// export const updateCartItemQuantity = async (cartId, bookId, quantity) => {
//   const { data, error } = await supabase
//       .from('CartItems')
//       .update({ quantity })
//       .eq('cart_id', cartId)
//       .eq('book_id', bookId);
//   if (error) console.log('Error updating cart item:', error.message);
//   return data;
// };

// PLACE an order
export const placeOrder = async (order) => {
  const { data, error } = await supabase.from("orders").insert([order]);
  if (error) console.log("Error placing order:", error.message);
  return data;
};

// GET all orders of a user

// ADD a new review
export const addReview = async (review) => {
  const { data, error } = await supabase.from("reviews").insert([review]);
  if (error) console.log("Error adding review:", error.message);
  return data;
};

// GET all reviews of a book
export const getReviewsForBook = async (bookId) => {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("book_id", bookId);
  if (error) console.log("Error fetching reviews:", error.message);
  return data;
};

// SEARCH for books by title, ISBN, or author
export const searchBooks = async (query) => {
  const { data, error } = await supabase
    .from("books")
    .select(
      `
      *,
      author:authors (author_name)
    `
    )
    .ilike("title", `%${query}%`); // Search in the title
  //.or(`isbn.ilike.%${query}%,authors.author_name.ilike.%${query}%`);  // Combine ISBN and author search

  if (error) {
    console.log("Error fetching search results:", error.message);
    return [];
  }
  console.log(data);

  return data;
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
        address_title,
        address:addresses (
          city,
          district,
          address_details
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

// UPDATE user addresses
// Add a new address for a user
export const addNewAddress = async (userId, addressData) => {
  try {
    const { data: newAddress, error: addressError } = await supabase
      .from("addresses")
      .insert([
        {
          city: addressData.city,
          district: addressData.district,
          address_details: addressData.address_details,
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

// GET user orders
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
          address_details
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
    .from('cart')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle(); // Avoids throwing an error for non-existent rows

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
    .from('cart')
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
    .from('cartitems')
    .select('*')
    .eq('cart_id', cartId)
    .eq('book_id', bookId)
    .maybeSingle(); // Avoids throwing an error for non-existent rows;

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
    .from('cartitems')
    .insert([{ cart_id: cartId, book_id: bookId, quantity, price }]);

  if (error) {
    console.log("Error adding item to cart:", error.message);
    return null;
  }

  return data;
};

export const updateCartItemQuantity = async (cartId, bookId, quantity) => {
  const { data, error } = await supabase
    .from('cartitems')
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
    .from('cartitems')
    .select(`
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
    .from('cartitems')
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
  return JSON.parse(localStorage.getItem('cart')) || [];
};


// Update quantity of an item in localStorage-based cart
export const updateLocalCartItemQuantity = (bookId, newQuantity) => {
  const cart = getLocalCartItems();

  // Update the quantity or remove the item if quantity <= 0
  const updatedCart = cart
    .map((item) =>
      item.book_id === bookId
        ? { ...item, quantity: newQuantity }
        : item
    )
    .filter((item) => item.quantity > 0); 
  
  localStorage.setItem('cart', JSON.stringify(updatedCart));
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
  console.log('Updated local cart:', updatedCart);

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
        .from('cartitems')
        .select('*')
        .eq('cart_id', cartId) 
        .eq('book_id', book_id)
        .maybeSingle(); // Avoids throwing an error for non-existent rows

      if (cartError && cartError.code !== 'PGRST116') {
        console.error(`Error checking book with ID ${book_id}:`, cartError.message);
        continue; // Skip to the next item
      }

      if (!existingCartItem) {
        // No rows returned, meaning the book is not yet in the user's cart
        console.log(`Book with ID ${book_id} is not in the user's cart. Adding...`);
        await addItemToCart(userId, book_id, quantity, price);
      } else {
        // If the book exists, update its quantity
        const updatedQuantity = existingCartItem.quantity + quantity;
        await updateCartItemQuantity(cartId, book_id, updatedQuantity);
      }
    }

    // Clear the localStorage cart
    localStorage.removeItem('cart');

    return await getCartItems(userId);
  } catch (error) {
    console.error('Error syncing local cart to database:', error);
    return [];
  }
};


// Subtract items from stock when a purchase is made
export const subtractItemsFromStock = async (bookId, quantity) => {
  const { data, error } = await supabase
    .from("books")
    .update({ available_quantity: supabase.raw("available_quantity - ?", [quantity]) })
    .eq("book_id", bookId);

  if (error) {
    console.log("Error updating stock:", error.message);
    return null;
  }

  return data;
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
      }
      else {
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
