import { supabase } from "../supabaseClient";


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
          book_id,
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