import { SupabaseAuth } from '../../supabase_main/Supabase';

/**
 * Method to sign-out using supabase.
 */
function firebaseSignOut(signOutHandler: () => void) {
  SupabaseAuth.signOut().then(() => {
    signOutHandler();
  });
}

// Export the function
export { firebaseSignOut };
