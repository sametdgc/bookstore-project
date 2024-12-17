import { supabase } from "../supabaseClient";


  
  // UPDATE user data
  export const updateUserData = async (updatedData) => {
    const { full_name, phone_number, tax_id } = updatedData;
  
    try {
      const user = await fetchUser();
      if (!user) {
        throw new Error("User is not logged in.");
      }
  
      const userId = user.user_metadata.custom_incremented_id;
  
      const { data, error } = await supabase
        .from("users")
        .update({ full_name, phone_number, tax_id })
        .eq("user_id", userId);
  
      if (error) {
        throw new Error("Error updating user data: " + error.message);
      }
  
      return data;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  };
  
  // Get role of a user by user_id
  // Fetch the role of a user by their user ID
  export const getUserRoleById = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role_id, role:roles(role_name)')
        .eq('user_id', userId)
        .single();
  
      if (error) {
        console.error('Error fetching user role:', error.message);
        return null;
      }
  
      return data.role;
    } catch (err) {
      console.error('Unexpected error fetching user role:', err);
      return null;
    }
  };
  
  
  