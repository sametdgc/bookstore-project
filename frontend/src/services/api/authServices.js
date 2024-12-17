import { supabase } from "../supabaseClient";

export const fetchUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

// GET all user data
export const getUserData = async () => {
  try {
    // Get the current session
    const user = await fetchUser();
    // Extract the user_id from the session metadata
    console.log(user)
    const userId = user.user_metadata.custom_incremented_id;
    // Query the users table with the user_id
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (error) {
      console.error("Error fetching user data:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.error("Error in getUserData function:", err);
    return null;
  }
};

// Listen for authentication state changes
export const onAuthStateChange = (callback) => {
  const { data: authListener } = supabase.auth.onAuthStateChange(
    (event, session) => {
      callback(session?.user || null);
    }
  );
  return authListener;
};

// Sign out the user
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error signing out:", error.message);
  }
  return error;
};

//test wheter you are connected to the api or not
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Error connecting to Supabase:", error);
    } else {
      console.log("Connection successful:", data);
    }
  } catch (err) {
    console.error("Unexpected error:", err);
  }
};