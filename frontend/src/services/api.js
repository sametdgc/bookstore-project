import { getUserAddresses, addNewAddress, deleteAddress, updateAddressDetails } from "./api/addressServices";
import { fetchUser, onAuthStateChange, signOut, testSupabaseConnection, getUserData } from "./api/authServices";
import { getOrCreateCartByUserId, addItemToCart, addItemToLocalCart, getCartItems, getLocalCartItems, removeCartItem, removeItemFromLocalCart,syncLocalCartToDatabase, updateCartItemQuantity, updateLocalCartItemQuantity } from "./api/cartServices";
import { getAllBooks, decrementBookStock, getAuthors, getBookById, getBookDetailsById, getBooksByGenre, getGenreIdByName, getGenres, getLanguages, searchBooks } from "./api/bookServices";
import { createDeliveryStatus,getDeliveredBooks,getOrderDetailsById,getUserOrders,placeOrder } from "./api/orderServices";
import { addBookToWishlist,addItemToLocalWishlist,getLocalWishlistItems,getWishlistByUserId,removeBookFromWishlist,removeItemFromLocalWishlist,syncLocalWishlistToDatabase } from "./api/wishlistServices";
import { getBestSellingBooks,getNewBooks,getTopRatedBooks } from "./api/mainPageServices";
import { createReturnRequest,getReturnHistoryByOrder } from "./api/returnServices";
import { getBooksWithStock,getDeliveryStatuses,updateBookStock,updateDeliveryStatus } from "./api/pmServices";
import { approveReview,disapproveReview,getPendingReviews,getPendingReviewsForBook,getReviewsForBook,submitReview } from "./api/reviewServices";
import { getUserRoleById,updateUserData } from "./api/userServices";
import { getAllInvoices, getRevenueByCategory, getTopCustomers, 
  getBestSellingBooksComposition,getDailyTotalRevenue, getTotalRevenue,updateBookPrice, getAllBooksRaw} from "./api/smServices";
import {applyDiscountToBook,getCurrentDiscount, endAllActiveDiscounts} from "./api/discountServices";


export {
  getUserAddresses,
  addNewAddress,
  deleteAddress,
  updateAddressDetails,
  fetchUser,
  onAuthStateChange,
  signOut,
  testSupabaseConnection,
  getOrCreateCartByUserId,
  addItemToCart,
  addItemToLocalCart,
  getCartItems,
  getLocalCartItems,
  removeCartItem,
  removeItemFromLocalCart,
  syncLocalCartToDatabase,
  updateCartItemQuantity,
  updateLocalCartItemQuantity,
  getAllBooks,
  decrementBookStock,
  getAuthors,
  getBookById,
  getBookDetailsById,
  getBooksByGenre,
  getGenreIdByName,
  getGenres,
  getLanguages,
  searchBooks,
  createDeliveryStatus,
  getDeliveredBooks,
  getOrderDetailsById,
  getUserOrders,
  placeOrder,
  addBookToWishlist,
  addItemToLocalWishlist,
  getLocalWishlistItems,
  getWishlistByUserId,
  removeBookFromWishlist,
  removeItemFromLocalWishlist,
  syncLocalWishlistToDatabase,
  getBestSellingBooks,
  getNewBooks,
  getTopRatedBooks,
  createReturnRequest,
  getReturnHistoryByOrder,
  getBooksWithStock,
  getDeliveryStatuses,
  updateBookStock,
  updateDeliveryStatus,
  approveReview,
  disapproveReview,
  getPendingReviews,
  getPendingReviewsForBook,
  getReviewsForBook,
  submitReview,
  getUserData,
  getUserRoleById,
  updateUserData,
  getAllInvoices,
  getRevenueByCategory,
  getTopCustomers,
  getBestSellingBooksComposition,
  getDailyTotalRevenue,
  getTotalRevenue,
  updateBookPrice,
  getAllBooksRaw,
  applyDiscountToBook,
  getCurrentDiscount,
  endAllActiveDiscounts,
}