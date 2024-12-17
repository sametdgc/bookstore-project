import { supabase } from "../supabaseClient";

// Fetch top rated books, ordered by average rating, gets the top 24
export const getTopRatedBooks = async () => {
  try {
    // Fetch books and reviews
    const { data: books, error: booksError } = await supabase.from("books").select("*");
    const { data: reviews, error: reviewsError } = await supabase.from("reviews").select("*");

    if (booksError || reviewsError) {
      console.error("Error fetching data:", booksError || reviewsError);
      return [];
    }

    // Create a map to store ratings for each book
    const ratingsMap = {};

    reviews.forEach((review) => {
      const bookId = review.book_id;
      if (!ratingsMap[bookId]) {
        ratingsMap[bookId] = { totalRating: 0, count: 0 };
      }
      ratingsMap[bookId].totalRating += review.rating;
      ratingsMap[bookId].count += 1;
    });

    // Calculate the average rating for each book
    const booksWithRatings = books.map((book) => {
      const ratingData = ratingsMap[book.book_id] || { totalRating: 0, count: 0 };
      const avgRating =
        ratingData.count > 0 ? ratingData.totalRating / ratingData.count : 0;

      return {
        ...book,
        avg_rating: avgRating,
      };
    });

    // Sort books by average rating in descending order and take the top 24
    const topRatedBooks = booksWithRatings
      .sort((a, b) => b.avg_rating - a.avg_rating)
      .slice(0, 24);

    return topRatedBooks;
  } catch (err) {
    console.error("Error calculating top rated books:", err);
    return [];
  }
};

// Fetch best selling books, ordered by order count, gets the top 4
export const getBestSellingBooks = async () => {
  try {
    // Fetch all orderitems and group by book_id
    const { data: orderItems, error: orderItemsError } = await supabase
      .from("orderitems")
      .select("book_id");

    if (orderItemsError) {
      console.error("Error fetching order items:", orderItemsError);
      return [];
    }

    // Count the occurrences of each book_id
    const bookCounts = orderItems.reduce((acc, item) => {
      acc[item.book_id] = (acc[item.book_id] || 0) + 1;
      return acc;
    }, {});

    // Sort book IDs by count in descending order and get the top 5
    const topBookIds = Object.entries(bookCounts)
      .sort((a, b) => b[1] - a[1]) // Sort by count
      .slice(0, 4) // Take top 5
      .map(([bookId]) => bookId); // Extract book IDs

    if (topBookIds.length === 0) {
      console.log("No books found in order items.");
      return [];
    }

    // Fetch book details for the top book IDs
    const { data: books, error: booksError } = await supabase
      .from("books")
      .select("book_id, title, price, image_url")
      .in("book_id", topBookIds);

    if (booksError) {
      console.error("Error fetching book details:", booksError);
      return [];
    }

    // Attach order counts to the book data
    const bestSellingBooks = books.map((book) => ({
      ...book,
      order_count: bookCounts[book.book_id],
    }));

    // Sort the final result by order_count for consistency
    bestSellingBooks.sort((a, b) => b.order_count - a.order_count);

    return bestSellingBooks;
  } catch (err) {
    console.error("Error fetching best selling books:", err);
    return [];
  }
};


// Fetch new books, ordered by book_id, gets the latest 4 books
export const getNewBooks = async () => {
  try {
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .order("book_id", { ascending: false }) // Order by the largest id
      .limit(4); 

    if (error) {
      console.error("Error fetching new books:", error);
      return [];
    }

    return data;
  } catch (err) {
    console.error("Error fetching new books:", err);
    return [];
  }
};
