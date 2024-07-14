// Import the functions you need from the SDKs you need
import { createClient } from '@supabase/supabase-js';
import {
  USER_PROFILE_TABLE,
  PROJECTS_TABLE,
  SUPABASE_KEY,
  SUPABASE_URL,
} from '../../env';

// Supabase configuration
const supabaseUrl = SUPABASE_URL;
const supabaseKey: string = SUPABASE_KEY;
const Supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Auth
const SupabaseAuth = Supabase.auth;

// Initialize users Database
const SupabaseUsersDB = Supabase.from(USER_PROFILE_TABLE);

// Initialize Projects Database
const SupabaseProjectsDB = Supabase.from(PROJECTS_TABLE);

// Initialize Storage
const SupabaseStorage = Supabase.storage;

// Export the functions
export { SupabaseAuth };
export { SupabaseUsersDB, SupabaseProjectsDB };
export { SupabaseStorage };
