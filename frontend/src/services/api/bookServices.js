import { supabase } from "../supabaseClient";

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
 
export const searchBooks = async (query) => {
    // Query for books by title, ISBN, description, or publisher
    const { data: booksByTitleOrIsbnOrDescorPub, error: mainError } = await supabase
      .from("books")
      .select(
        `
        *,
        author:authors (author_name) -- Join the authors table to get author_name
      `
      )
      .or(`title.ilike.%${query}%,isbn.ilike.%${query}%,description.ilike.%${query}%,publisher.ilike.%${query}%`); // Search in title, ISBN, description, or publisher
  
    if (mainError) {
      console.log("Error fetching books by title, ISBN, description, or publisher:", mainError.message);
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
  
    // Query for discounts for all retrieved books
    const bookIds = filteredResults.map((book) => book.book_id);
    const { data: discounts, error: discountError } = await supabase
    .from("bookdiscounts")
    .select(
      `
      book_id,
      discounts (
        discount_id,
        discount_name,
        discount_rate,
        start_date,
        end_date
      )
    `
    )
    .in("book_id", bookIds); // Get discounts for the retrieved books
  
    if (discountError) {
      console.log("Error fetching discount data:", discountError.message);
      return filteredResults; // Return results without discounts if the query fails
    }
  
    // Filter for active discounts (end_date is null or in the future)
    const currentDate = new Date().toISOString();
    const activeDiscounts = discounts.filter((discount) => {
      const { end_date, start_date } = discount.discounts;
      return !end_date || new Date(end_date) > new Date(currentDate);
    });
  
    console.log(activeDiscounts);
    // Get the most recent active discount for each book
    const discountsByBookId = {};
    activeDiscounts.forEach((discount) => {
      if (
        !discountsByBookId[discount.book_id] ||
        new Date(discount.discounts.start_date) >
        new Date(discountsByBookId[discount.book_id].discounts.start_date)
              ) {
        discountsByBookId[discount.book_id] = discount;
      }
    });

    console.log(discountsByBookId);
    console.log(filteredResults);
    // Merge the discount rate into books
    const booksWithDiscountRate = filteredResults.map((book) => ({
      ...book,
      discount_rate: discountsByBookId[book.book_id]?.discounts.discount_rate || 0, // Set discount_rate to 0 if no valid discount
    }));
    
    return booksWithDiscountRate;
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
  
  export const decrementBookStock = async (bookId, quantity) => {
    try {
      // Call the updated stored procedure
      const { error } = await supabase.rpc("decrement_stock", {
        book_id_input: bookId, // Updated to match the new parameter name
        quantity_input: quantity, // Updated to match the new parameter name
      });
  
      if (error) {
        console.error(`Error decrementing stock for book ID ${bookId}:`, error.message);
        return { success: false, message: error.message };
      }
  
      return { success: true };
    } catch (err) {
      console.error("Unexpected error decrementing book stock:", err.message);
      return { success: false, message: "Unexpected error occurred." };
    }
  };
  
// Add a new book
export const addBook = async (book) => {
  const { data, error } = await supabase.from("books").insert([book]);

  if (error) {
    console.error("Error adding new book:", error.message);
    return { success: false, message: error.message };
  }

  return { success: true, data };
};