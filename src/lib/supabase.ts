import { createClient } from "@supabase/supabase-js";

console.log("SUPABASE URL:", process.env.REACT_APP_PUBLIC_SUPABASE_URL);
console.log("SUPABASE KEY:", process.env.REACT_APP_PUBLIC_SUPABASE_ANON_KEY);

if (!process.env.REACT_APP_PUBLIC_SUPABASE_URL || !process.env.REACT_APP_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Supabase environment variables are missing!");
}

export const supabase = createClient(
  process.env.REACT_APP_PUBLIC_SUPABASE_URL,
  process.env.REACT_APP_PUBLIC_SUPABASE_ANON_KEY
); 