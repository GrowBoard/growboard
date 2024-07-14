import { SupabaseAuth } from '../../supabase_main/Supabase';

/**
 * Method to sign-in using firebase.
 */
function firebaseForgotPassword(
  email: string,
  forgotPasswordHandler: () => void,
  errorCallback: (error: string) => void,
) {
  if (email !== null)
    SupabaseAuth.resetPasswordForEmail(email)
      .then((response: any) => {
        forgotPasswordHandler();
      })
      .catch((error: { code: any; message: any }) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        errorCallback(errorMessage);
      });
}

// Export the function
export { firebaseForgotPassword };
