import { supabase } from "../supabaseClient";


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