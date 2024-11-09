import { createClient } from '@supabase/supabase-js';

const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFydWtxYmhsZnplYXNwYmtvdW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA2NDI1MDksImV4cCI6MjA0NjIxODUwOX0.Yl1wOsFN6OSU46CHcYe_1XGTxVR67uJm9wX3-sbh3Oo";
const supabaseUrl = 'https://arukqbhlfzeaspbkoumi.supabase.co';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
