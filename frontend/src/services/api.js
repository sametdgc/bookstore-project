import {supabase} from './supabaseClient'

// Fetch all genres
export const getGenres = async () => {
    const { data, error } = await supabase
        .from('genres')
        .select('*');
    if (error) {
        console.log('Error fetching genres:', error.message);
        return []; 
    }
    return data; 
};

// GET all books with pagination
export const getAllBooks = async (limit, offset) => {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .range(offset, offset + limit - 1); 

  if (error) {
    console.log('Error fetching books:', error.message);
  }

  return data;
};

// GET a book with genre, author, language, and reviews
export const getBookDetailsById = async (bookId) => {
  const { data, error } = await supabase
    .from('books')
    .select(`
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
    `)
    .eq('book_id', bookId)
    .single();

  if (error) {
    console.log('Error fetching book details:', error.message);
    return null;
  }

  // Filter only approved reviews
  if (data.reviews) {
    data.reviews = data.reviews.filter((review) => review.approval_status === true);
  }

  return data;
};


// GET books by id
export const getBookById = async (bookId) => {
  const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('book_id', bookId)
      .single();
  if (error) console.log('Error fetching book:', error.message);
  return data;
};

// UPDATE a book
export const updateBook = async (bookId, updates) => {
  const { data, error } = await supabase
      .from('books')
      .update(updates)
      .eq('book_id', bookId);
  if (error) console.log('Error updating book:', error.message);
  return data;
};

// GET cart of a user
export const getCartByUserId = async (userId) => {
  const { data, error } = await supabase
      .from('Cart')
      .select('*')
      .eq('user_id', userId)
      .single();
  if (error) console.log('Error fetching cart:', error.message);
  return data;
};

// ADD an item to the cart
export const addItemToCart = async (cartId, cartItem) => {
  const { data, error } = await supabase
      .from('CartItems')
      .insert([{ cart_id: cartId, ...cartItem }]);
  if (error) console.log('Error adding item to cart:', error.message);
  return data;
};

// UPDATE an item's quantity in the cart
export const updateCartItemQuantity = async (cartId, bookId, quantity) => {
  const { data, error } = await supabase
      .from('CartItems')
      .update({ quantity })
      .eq('cart_id', cartId)
      .eq('book_id', bookId);
  if (error) console.log('Error updating cart item:', error.message);
  return data;
};

// PLACE an order
export const placeOrder = async (order) => {
  const { data, error } = await supabase
      .from('Orders')
      .insert([order]);
  if (error) console.log('Error placing order:', error.message);
  return data;
};

// GET all orders of a user



// ADD a new review
export const addReview = async (review) => {
  const { data, error } = await supabase
      .from('Reviews')
      .insert([review]);
  if (error) console.log('Error adding review:', error.message);
  return data;
};

// GET all reviews of a book
export const getReviewsForBook = async (bookId) => {
  const { data, error } = await supabase
      .from('Reviews')
      .select('*')
      .eq('book_id', bookId);
  if (error) console.log('Error fetching reviews:', error.message);
  return data;
};

// ADD a book to the wishlist
export const addBookToWishlist = async (userId, bookId) => {
  const { data, error } = await supabase
      .from('Wishlist')
      .insert([{ user_id: userId, book_id: bookId }]);
  if (error) console.log('Error adding book to wishlist:', error.message);
  return data;
};

// GET the wishlist of a user
export const getWishlistByUserId = async (userId) => {
  const { data, error } = await supabase
      .from('Wishlist')
      .select('*')
      .eq('user_id', userId);
  if (error) console.log('Error fetching wishlist:', error.message);
  return data;
};

// SEARCH for books by title, ISBN, or author
export const searchBooks = async (query) => {
  const { data, error } = await supabase
    .from('books')
    .select(`
      *,
      author:authors (author_name)
    `)
    .ilike('title', `%${query}%`);  // Search in the title
    //.or(`isbn.ilike.%${query}%,authors.author_name.ilike.%${query}%`);  // Combine ISBN and author search

  if (error) {
    console.log('Error fetching search results:', error.message);
    return [];
  }
  console.log(data);

  return data;
};



// GET a books by genre
export const getBooksByGenre = async (genreId) => {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('genre_id', genreId);

  if (error) {
    console.log('Error fetching books by genre:', error.message);
    return [];
  }

  return data;
}

// GET genre id by name
export const getGenreIdByName = async (genreName) => {
  const { data, error } = await supabase
    .from('genres')
    .select('genre_id')
    .ilike('genre_name', `%${genreName}%`)
    .single();

  if (error) {
    console.log('Error fetching genre ID:', error.message);
    return null;
  }

  return data.genre_id;
};


/* 

  AUTHENTICATION SERVICES

*/


// Fetch the current user
export const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
};

// Listen for authentication state changes
export const onAuthStateChange = (callback) => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        callback(session?.user || null);
    });
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
        console.error('Error connecting to Supabase:', error);
      } else {
        console.log('Connection successful:', data);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  // Function to get user data by user_id from the session
export const getUserData = async () => {
  try {
    // Get the current session
    const user = await fetchUser();
    // Extract the user_id from the session metadata
    const userId = user.user_metadata.custom_incremented_id;
    // Query the users table with the user_id
    const { data, error } = await supabase
      .from('users')  // Assuming your table is named 'users'
      .select('*')  // You can select specific fields if needed
      .eq('user_id', userId)  // Filter by the user_id from session
      .single();  // Assuming you expect one user record for that ID

    // Check for errors
    if (error) {
      console.error('Error fetching user data:', error.message);
      return null;
    }

    // Return the fetched user data
    return data;
  } catch (err) {
    console.error('Error in getUserData function:', err);
    return null;
  }
};

