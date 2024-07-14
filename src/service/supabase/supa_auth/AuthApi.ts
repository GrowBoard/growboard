import { AuthDataState } from '@store';
import { AuthTokenKey } from '../../local_storage/token_constants/StorageConstant';
import { firebaseForgotPassword } from './actions/AuthForgotPassword';
import { LoginCred, firebaseSingIn } from './actions/AuthSignIn';
import { firebaseSignOut } from './actions/AuthSignOut';
import supabaseSignUp, { SignUpCred } from './actions/AuthSignUp';

/**
 * Method to make the Firebase signin
 */
function signIn(
  cred: LoginCred,
  signInHandler: (authData: AuthDataState) => void,
  errorCallback: (error: string) => void,
) {
  firebaseSingIn(cred, signInHandler, errorCallback);
}

/**
 * Method to make the Firebase signup
 */
function signUp(
  cred: SignUpCred,
  signUpHandler: () => void,
  errorCallback: (error: string) => void,
) {
  supabaseSignUp(cred, signUpHandler, errorCallback);
}

/**
 * Method to make firebase signout
 */
function signOut(signOutHandler: () => void) {
  firebaseSignOut(signOutHandler);
}

/**
 * Method to make the firebase forgot password.
 */
function forgotPassword(
  email: string,
  forgotPasswordHandler: () => void,
  errorCallback: (error: string) => void,
) {
  firebaseForgotPassword(email, forgotPasswordHandler, errorCallback);
}

/**
 * Method to make the firebase already signin
 *
 */
function alreadySignedIn(signOutHandler: () => void) {
  const authData = localStorage.getItem(AuthTokenKey);
  if (!authData) {
    signOutHandler();
    return;
  }
}

// Export the function
export { signIn, signUp, signOut, forgotPassword, alreadySignedIn };
