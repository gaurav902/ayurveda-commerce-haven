// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ebbqfgvrgqxqauhbtpax.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViYnFmZ3ZyZ3F4cWF1aGJ0cGF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4MDI4ODEsImV4cCI6MjA1NzM3ODg4MX0.46xTW1gnNbMLTquGT9n3gx5v4rbXAz21hilx616SNWA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);