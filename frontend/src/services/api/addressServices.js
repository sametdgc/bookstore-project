import { supabase } from "../supabaseClient";
import { fetchUser } from "./authServices";


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
          address_id,
          address_title,
          address:addresses (
            city,
            district,
            address_details,
            zip_code
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
  
  // ADD a new address for a user
  export const addNewAddress = async (userId, addressData) => {
    try {
      const { data: newAddress, error: addressError } = await supabase
        .from("addresses")
        .insert([
          {
            city: addressData.city,
            district: addressData.district,
            address_details: addressData.address_details,
            zip_code: addressData.zip_code, // Add zip_code
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
  
  // UPDATE an existing address for a user
  export const updateAddressDetails = async (
    userId,
    addressId,
    updatedAddressData
  ) => {
    try {
      // Update the `addresses` table with the new details (city, district, address_details, zip_code)
      const { error: addressError } = await supabase
        .from("addresses")
        .update({
          city: updatedAddressData.city,
          district: updatedAddressData.district,
          address_details: updatedAddressData.address_details,
          zip_code: updatedAddressData.zip_code, // Update zip_code
        })
        .eq("address_id", addressId); // Match the address_id
  
      if (addressError) {
        throw new Error(
          "Error updating address details: " + addressError.message
        );
      }
  
      // Update the `address_title` in the `useraddresses` table if provided
      const { error: userAddressError } = await supabase
        .from("useraddresses")
        .update({
          address_title: updatedAddressData.address_title,
        })
        .eq("user_id", userId) // Match the user_id
        .eq("address_id", addressId); // Match the address_id
  
      if (userAddressError) {
        throw new Error(
          "Error updating address title: " + userAddressError.message
        );
      }
  
      return { success: true };
    } catch (error) {
      console.error(error.message);
      return { success: false, error: error.message };
    }
  };
  
  // DELETE an address for a user
  export const deleteAddress = async (addressId) => {
    try {
      // Delete the address from the `addresses` table
      const { error } = await supabase
        .from("addresses")
        .delete()
        .eq("address_id", addressId);
  
      if (error) {
        throw new Error("Error deleting address: " + error.message);
      }
  
      // Return success
      return { success: true };
    } catch (error) {
      console.error(error.message);
      return { success: false, error: error.message };
    }
  };