import { supabase } from "../supabaseClient";
import { decrementBookStock, fetchUser } from "../api";

export const placeOrder = async (orderDetails, cartItems) => {
    // Step 1: Check stock for all cart items
    const insufficientStockItems = [];
    for (const item of cartItems) {
      const { data: book, error: bookError } = await supabase
        .from("books")
        .select("available_quantity")
        .eq("book_id", item.book_id)
        .single();
  
      if (bookError) {
        console.error(`Error fetching stock for book ID ${item.book_id}:`, bookError.message);
        return { success: false, message: bookError.message };
      }
  
      if (book.available_quantity < item.quantity) {
        insufficientStockItems.push({
          book_id: item.book_id,
          available_quantity: book.available_quantity,
        });
      }
    }
  
    if (insufficientStockItems.length > 0) {
      return {
        success: false,
        message: "Some items do not have enough stock.",
        insufficientStockItems,
      };
    }
  
    // Step 2: Place the order
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert([orderDetails])
      .select("*");
  
    if (orderError) {
      console.error("Error placing order:", orderError.message);
      return { success: false, message: orderError.message };
    }
  
    const newOrderId = orderData[0].order_id;
  
    // Step 3: Insert order items
    const orderItems = cartItems.map((item) => ({
      order_id: newOrderId,
      book_id: item.book_id,
      quantity: item.quantity,
      item_price: item.book.price * (100- item.book.discount)/100
    }));
  
    const { error: orderItemsError } = await supabase.from("orderitems").insert(orderItems);
  
    if (orderItemsError) {
      console.error("Error inserting order items:", orderItemsError.message);
      return { success: false, message: orderItemsError.message };
    }
  
    // Step 4: Decrease stock for each book using decrementBookStock
    for (const item of cartItems) {
      const { success, message } = await decrementBookStock(item.book_id, item.quantity);
  
      if (!success) {
        console.error(`Error decrementing stock for book ID ${item.book_id}:`, message);
        return { success: false, message };
      }
    }
  
    // Step 5: Delete cart items (Updated)
    for (const item of cartItems) {
      const { error: cartDeleteError } = await supabase
        .from("cartitems")
        .delete()
        .match({
          cart_id: item.cart_id, 
          book_id: item.book_id, 
        });
  
      if (cartDeleteError) {
        console.error(`Error deleting cart item with cart_id ${item.cart_id} and book_id ${item.book_id}:`, cartDeleteError.message);
        return { success: false, message: cartDeleteError.message };
      }
    }
  
    // Step 6: Create delivery status entry
    const { success: deliveryStatusSuccess, message: deliveryStatusMessage } =
      await createDeliveryStatus(newOrderId);
  
    if (!deliveryStatusSuccess) {
      console.error("Error creating delivery status:", deliveryStatusMessage);
      return { success: false, message: deliveryStatusMessage };
    }
  
    return { success: true, data: orderData[0] };
};

export const createDeliveryStatus = async (orderId) => {
    const { data, error } = await supabase
      .from("deliverystatuses")
      .insert([{ order_id: orderId }]);
    if (error) {
      console.error("Error creating delivery status:", error.message);
      return { success: false, message: error.message };
    }
    return { success: true, data };
  };
  

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
        books (
            title,
            image_url
        )
        ),
        delivery_status:deliverystatuses!order_id (
        status,
        last_updated
        )
    `
    )
    .order("order_id", { ascending: false })
    .eq("user_id", userId);
    

    if (error) {
    console.error("Error fetching user orders:", error.message);
    return [];
    }

    // Transform the data to add book titles and image URLs directly to order items
    const transformedData = data.map((order) => ({
    ...order,
    order_items: order.order_items.map((item) => ({
        ...item,
        book_title: item.books.title,
        book_image_url: item.books.image_url,
    })),
    delivery_status: order.delivery_status[0], // Ensure it's picking the first status associated with the order
    }));

    return transformedData;
} catch (err) {
    console.error("Error in getUserOrders function:", err);
    return [];
}
};


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
              books (
                title,
                image_url
              )
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


export const getDeliveredBooks = async (userId) => {
try {
    // orders associated with the user
    const { data: orders, error: orderError } = await supabase
        .from("orders")
        .select("order_id")
        .eq("user_id", userId);
    if (orderError) {
        console.error("Error fetching orders:", orderError.message);
        return [];
    }
    if (!orders || orders.length === 0) {
        return [];
    }
    const orderIds = orders.map((order) => order.order_id);

    // delivery statuses for the user's orders
    const { data: deliveries, error: deliveryError } = await supabase
        .from("deliverystatuses")
        .select("order_id")
        .in("order_id", orderIds)
        .eq("status", "delivered");
    if (deliveryError) {
        console.error("Error fetching delivery statuses:", deliveryError.message);
        return [];
    }
    if (!deliveries || deliveries.length === 0) {
        return [];
    }
    const deliveredOrderIds = deliveries.map((delivery) => delivery.order_id);

    // books associated with the delivered orders
    const { data: deliveredBooks, error: bookError } = await supabase
        .from("orderitems")
        .select("book_id")
        .in("order_id", deliveredOrderIds);
    if (bookError) {
        console.error("Error fetching delivered books:", bookError.message);
        return [];
    }
    return deliveredBooks || [];
} catch (err) {
    console.error("Unexpected error fetching delivered books:", err);
    return [];
}
};

