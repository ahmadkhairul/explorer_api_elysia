import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.APP_DATA_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.APP_DATA_SUPABASE_ANON_KEY || 'your_anon_key';

export const supabase = createClient(supabaseUrl, supabaseKey);