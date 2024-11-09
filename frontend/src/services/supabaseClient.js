import { createClient } from '@supabase/supabase-js';

const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkcWhucXZ6bHRjemFpcHF2andnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzExMDE4NjcsImV4cCI6MjA0NjY3Nzg2N30.amJOKM3N74VFB0WybhBe_uRRyB3K7e-hvdBK2Y6kUUE";
const supabaseUrl = 'https://zdqhnqvzltczaipqvjwg.supabase.co';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
