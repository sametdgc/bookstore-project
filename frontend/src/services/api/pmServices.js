import { supabase } from "../supabaseClient";

export const getBooksWithStock = async (
    searchQuery = "",
    outOfStockOnly = false,
    page = 1,
    limit = 10
  ) => {
    const start = (page - 1) * limit;
    const end = start + limit - 1;
  
    let query = supabase
      .from("books")
      .select("book_id, title, image_url, available_quantity", { count: "exact" })
      .range(start, end);
  
    if (searchQuery) {
      // Correct syntax for OR query with Supabase
      query = query.or(`title.ilike.%${searchQuery}%,book_id::text.ilike.%${searchQuery}%`);
    }
  
    if (outOfStockOnly) {
      query = query.eq("available_quantity", 0);
    }
  
    const { data, count, error } = await query;
  
    if (error) {
      console.error("Error fetching books with stock:", error.message);
      return { data: [], count: 0 };
    }
  
    return { data, count };
  };
  
  
  // Update the stock for a book
  export const updateBookStock = async (bookId, newStock) => {
    const { data, error } = await supabase
      .from("books")
      .update({ available_quantity: newStock })
      .eq("book_id", bookId);
  
    if (error) {
      console.error("Error updating book stock:", error.message);
      return { success: false };
    }
  
    return { success: true, data };
  };


// Fetch delivery statuses, and customer name form the order table
// export const getDeliveryStatuses = async () => {
//   const { data, error } = await supabase
//     .from("deliverystatuses")
//     .select(
//       `
//       *,
//       order:orders (order_id, order_date, total_price, user_id, users:users (full_name))
//     `
//     );

//   if(error) {
//     console.error("Error fetching delivery statuses:", error.message);
//     return [];
//   }
//   else {
//     return data;
//   } 
// }
export const getDeliveryStatuses = async (page, itemsPerPage) => {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage - 1;

  const { data, count, error } = await supabase
    .from("deliverystatuses")
    .select(
      `
      *,
      order:orders (
        order_id,
        order_date,
        total_price,
        user_id,
        users:users (full_name),
        address:addresses (address_details, city, district)
      )
    `,
      { count: "exact" }
    )
    .range(start, end);

  if (error) {
    console.error("Error fetching delivery statuses:", error.message);
    return { data: [], count: 0 };
  } else {
    return { data, count };
  }
};


// Update delivery status
export const updateDeliveryStatus = async (orderId, newStatus) => {
  const { error } = await supabase
    .from('deliverystatuses')
    .update({ status: newStatus })
    .eq('order_id', orderId);

  if (error) {
    throw error;
  }
};