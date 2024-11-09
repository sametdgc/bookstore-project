import {supabase} from './supabaseClient'

// Fetch all genres
export const getGenres = async () => {
    const { data, error } = await supabase
        .from('genres')
        .select('*');
    if (error) {
        console.log('Error fetching genres:', error.message);
        return []; 
    }
    return data; 
};


// Fetch the current user
export const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
};

// Listen for authentication state changes
export const onAuthStateChange = (callback) => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        callback(session?.user || null);
    });
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
