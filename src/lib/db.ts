import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface User {
  id: string;
  username: string;
  password_hash: string;
  display_name: string;
  created_at: string;
}

export interface Update {
  id: string;
  user_id: string;
  message: string;
  score: number;
  created_at: string;
  week_start_date: string;
}

