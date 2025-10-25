import { createClient } from '@supabase/supabase-js'

// Read the keys from the secure .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if the environment variables are actually set
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be defined in your .env.local file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)