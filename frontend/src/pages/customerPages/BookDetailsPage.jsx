import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import {
  getBookDetailsById,
  addItemToCart,
  addItemToLocalCart,
  fetchUser,
  getLocalWishlistItems,
  addItemToLocalWishlist,
  removeItemFromLocalWishlist,
  addBookToWishlist,
  removeBookFromWishlist,
  getWishlistByUserId,
  getCurrentDiscount,
} from "../../services/api";
import ReviewWindow, { renderStars } from "../../components/ReviewWindow";

const BookDetailsPage = () => {
  const { book_id } = useParams();
  const [book, setBook] = useState(null);
  const [wishlistMessage, setWishlistMessage] = useState("");
  const [wishlistMessageColor, setWishlistMessageColor] = useState("");
  const [cartMessage, setCartMessage] = useState("");
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [user, setUser] = useState(null);
  const [currentDiscount, setCurrentDiscount] = useState(0);

  useEffect(() => {
    const fetchBookDetails = async () => {
      const bookData = await getBookDetailsById(book_id);
      if (bookData) {
        // Calculate average rating if reviews are available
        const totalRating = bookData.reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        const averageRating =
          bookData.reviews.length > 0
            ? totalRating / bookData.reviews.length
            : 0;
        setBook({ ...bookData, ratings: averageRating });
      }
    };

    const fetchCurrentUser = async () => {
      const currentUser = await fetchUser();
      setUser(currentUser);

      if (currentUser) {
        // If logged in, fetch the wishlist from the database
        const userId = currentUser.user_metadata.custom_incremented_id;
        const wishlist = await getWishlistByUserId(userId);
        setIsInWishlist(
          wishlist.some((item) => item.book_id === parseInt(book_id))
        );
      } else {
        // Otherwise, check the local wishlist
        const existingWishlist = getLocalWishlistItems();
        setIsInWishlist(
          existingWishlist.some((item) => item.book_id === parseInt(book_id))
        );
      }
    };

    //get current discount
    const fetchDiscount = async () => {
      console.log("fetching discount");
      console.log(book_id);
      const { data } = await getCurrentDiscount(book_id);
      if (data) {
        setCurrentDiscount(data.discount_rate);
      }
    };

    fetchDiscount();
    fetchBookDetails();
    fetchCurrentUser();
  }, [book_id]);

  const handleAddToCart = async () => {
    if (!book) return;

    const { book_id, price } = book;

    if (user) {
      // Logged-in user: Add item to database cart
      const userId = user.user_metadata.custom_incremented_id;
      await addItemToCart(userId, book_id, 1, price);
    } else {
      // Anonymous user: Add item to localStorage cart
      addItemToLocalCart(book_id, 1, price);
    }

    setCartMessage("Product is successfully added to your cart!");
    setTimeout(() => setCartMessage(""), 2000);
  };

  const handleWishlistToggle = async () => {
    if (!book) return;

    const { book_id, title, image_url } = book;

    if (user) {
      // Logged-in user: Update the database wishlist
      const userId = user.user_metadata.custom_incremented_id;

      if (isInWishlist) {
        // Remove the book from the database wishlist
        await removeBookFromWishlist(userId, book_id);
        setWishlistMessage(
          "The product is successfully removed from your wishlist."
        );
        setWishlistMessageColor("bg-gray-300");
      } else {
        // Add the book to the database wishlist
        await addBookToWishlist(userId, book_id);
        setWishlistMessage(
          "The product is successfully added to your wishlist!"
        );
        setWishlistMessageColor("bg-red-500");
      }
    } else {
      // Anonymous user: Update the local wishlist
      const localWishlist = getLocalWishlistItems();

      if (isInWishlist) {
        // Remove from local wishlist
        const updatedWishlist = removeItemFromLocalWishlist(book_id);
        setWishlistMessage(
          "The product is successfully removed from your wishlist."
        );
        setWishlistMessageColor("bg-gray-300");
      } else {
        // Add to local wishlist
        const newItem = { book_id, title, image_url };
        addItemToLocalWishlist(newItem);
        setWishlistMessage(
          "The product is successfully added to your wishlist!"
        );
        setWishlistMessageColor("bg-red-500");
      }
    }

    // Update the state to reflect the new wishlist status
    setIsInWishlist(!isInWishlist);
    setTimeout(() => setWishlistMessage(""), 2000);
  };

  if (!book)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-16 px-4 relative">
        {/* Wishlist success message */}
        {wishlistMessage && (
          <div
            className={`absolute top-2 left-1/2 transform -translate-x-1/2 ${wishlistMessageColor} text-white px-4 py-2 rounded-lg shadow-md z-50 inline-block`}
          >
            {wishlistMessage}
          </div>
        )}

        {/* Cart success message */}
        {cartMessage && (
          <div
            className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-[#65aa92] text-white px-4 py-2 rounded-lg shadow-md z-50 inline-block"
          >
            {cartMessage}
          </div>
        )}

        <div className="bg-white shadow-md rounded-md p-8 flex flex-col md:flex-row items-start md:items-start space-y-8 md:space-y-0 md:space-x-8">
          <div className="md:w-1/4 flex justify-center md:justify-start relative">
            <div
              className="absolute top-2 right-2 z-10"
              onClick={(e) => {
                e.stopPropagation();
                handleWishlistToggle();
              }}
            >
              <FaHeart
                size={24}
                className={isInWishlist ? "text-red-500" : "text-gray-300"}
              />
            </div>
            <img
              src={book.image_url || "https://via.placeholder.com/200x300"}
              alt={`${book.title} cover`}
              className="rounded-lg shadow-lg object-cover"
              style={{ width: "100%", height: "350px", maxWidth: "250px" }}
            />
          </div>
          <div className="md:w-2/4 flex flex-col space-y-4">
            <h1 className="text-4xl font-bold text-[#65aa92]">{book.title}</h1>
            <p className="text-2xl text-gray-700">{book.author.author_name}</p>
            <p className="text-md text-gray-600 mt-2">{book.description}</p>
            <div className="text-md text-gray-500 space-y-1">
              <p>
                <span className="font-semibold">Genre:</span>{" "}
                {book.genre.genre_name}
              </p>
              <p>
                <span className="font-semibold">Publisher:</span>{" "}
                {book.publisher}
              </p>
              <p>
                <span className="font-semibold">ISBN:</span> {book.isbn}
              </p>
              <p>
                <span className="font-semibold">Language:</span>{" "}
                {book.language.language_name}
              </p>
              <p>
                <span className="font-semibold">Stock:</span>{" "}
                {book.available_quantity}
              </p>
              <span className="flex items-center">
                <span className="font-semibold">Average Rating:</span>
                <span className="ml-2 flex items-center">
                  {book.reviews.length > 0 ? (
                    <>
                      {renderStars(book.ratings)}
                      <span className="ml-2 text-black">
                        {book.ratings.toFixed(1)} / 5
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-600">No ratings yet.</span>
                  )}
                </span>
              </span>
            </div>
          </div>
          <div className="md:w-1/4 flex flex-col items-center md:items-end justify-center space-y-4 self-stretch">
            <div
              className="bg-gray-50 p-4 rounded-md shadow-lg flex justify-center gap-x-4 items-center w-full"
              style={{ width: "300px", height: "60px" }}
            >
              {/* Discounted Price */}
              {console.log(currentDiscount)}
              {currentDiscount > 0 ? (
                <p className="text-[#4a886e] font-bold text-2xl">
                  ${(
                    book.price -
                    book.price * (currentDiscount / 100)
                  ).toFixed(2)}
                </p>
              ) : (
                <p className="text-gray-700 text-2xl font-semibold">
                  ${book.price.toFixed(2)}
                </p>
              )}


              {/* Original Price */}
              {currentDiscount > 0 && (
                <p className="text-gray-500 line-through text-sm">
                  ${book.price.toFixed(2)}
                </p>
              )}
            </div>
            <button
              onClick={book.available_quantity > 0 ? handleAddToCart : null}
              className={`py-2 px-4 rounded font-semibold text-center transition text-white text-xl ${
                book.available_quantity > 0
                  ? "bg-[#65aa92] hover:bg-[#4a886e] cursor-pointer"
                  : "bg-red-500 cursor-not-allowed"
              }`}
              style={{ width: "300px", height: "50px" }}
              disabled={book.available_quantity === 0}
            >
              {book.available_quantity > 0 ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        </div>

        <ReviewWindow book={book} />
      </div>
    </div>
  );
};

export default BookDetailsPage;
