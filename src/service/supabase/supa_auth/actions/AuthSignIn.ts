import { AuthDataState } from '@store';
import { SupabaseAuth } from '../../supabase_main/Supabase';

/**
 * Interface for the login credentials.
 */
interface LoginCred {
  email: string;
  password: string;
}

/**
 * Method to sign-in using firebase.
 */
async function firebaseSingIn(
  cred: LoginCred,
  signInHandler: (authData: AuthDataState) => void,
  errorCallback: (error: string) => void,
) {
  if (cred.email !== null && cred.password !== null)
    try {
      const { data, error } = await SupabaseAuth.signInWithPassword({
        email: cred.email,
        password: cred.password,
      });
      if (error) {
        console.log(error);
        errorCallback(error.message);
      } else {
        console.log(data);
        const authData: AuthDataState = {
          authToken: data.session.access_token,
          userData: {
            userId: data.user.id,
            firstName: data.user.user_metadata.fName,
            lastName: data.user.user_metadata.lName,
            email: data.user.email ? data.user.email : '',
          },
        };
        signInHandler(authData);
      }
    } catch (error: any) {
      console.log(error);
      errorCallback(error);
    }
}

// Export the function
export { firebaseSingIn };
export type { LoginCred };
