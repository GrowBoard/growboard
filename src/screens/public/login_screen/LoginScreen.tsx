import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ErrorText, InputText, InputType, LandingIntro } from '@dash-ui';

import { LoginCred } from '@service/supabase/supa_auth/actions/AuthSignIn';
import { signIn } from '@service/supabase/supa_auth/AuthApi';
import { validatePassword } from '../../../util/input/Input';
import { useTranslation } from 'react-i18next';
import { AuthDataState, appStore } from '@store';
import { authSelector, useShallow } from '@selectors';

interface UpdateProps {
  updateType: string;
  value: string;
}

/**
 * Component definition for the login screen.
 *
 * @returns The Login component.
 */
function Login() {
  const { t } = useTranslation();
  const INITIAL_LOGIN_OBJ: LoginCred = {
    password: '',
    email: '',
  };
  const { setLoginData } = appStore(useShallow(authSelector));
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loginObj, setLoginObj] = useState<LoginCred>(INITIAL_LOGIN_OBJ);

  const signInHandler = (authData: AuthDataState) => {
    setLoginData(authData);
  };

  const submitForm = (e: any) => {
    e.preventDefault();
    setErrorMessage('');
    if (loginObj.email.trim() === '')
      return setErrorMessage(t('LoginError.emailRequired'));
    if (loginObj.password.trim() === '')
      return setErrorMessage(t('LoginError.passwordRequired'));
    else if (!validatePassword(loginObj.password)) {
      return setErrorMessage(t('LoginError.passwordPolicy'));
    } else {
      setLoading(true);
      signIn(loginObj, signInHandler, (error: string) => {
        console.log('error', error);
        setErrorMessage(error);
      });
      setLoading(false);
    }
  };

  const updateFormValue = ({ updateType, value }: UpdateProps) => {
    setErrorMessage('');
    setLoginObj({ ...loginObj, [updateType]: value });
  };

  return (
    <div
      className="h-screen bg-base-200 flex items-center"
      style={{
        backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
        backgroundSize: 'cover',
      }}
    >
      <div className="card mx-auto w-full max-w-5xl shadow-xl ">
        <div className="grid md:grid-cols-2 grid-cols-1">
          <div className="glass rounded-l-2xl">
            <LandingIntro />
          </div>
          <div className="py-24 px-10 bg-primary-content">
            <h2 className="text-2xl font-semibold mb-2 text-center">
              {t('LoginScreen.title')}
            </h2>
            <form onSubmit={(e) => submitForm(e)}>
              <div className="mb-4">
                <InputText
                  type={InputType.EMAIL}
                  defaultValue={loginObj.email}
                  updateType="email"
                  containerStyle="mt-4"
                  labelTitle={t('Account.input.email')}
                  updateFormValue={updateFormValue}
                  errorState={errorMessage !== ''}
                />

                <InputText
                  defaultValue={loginObj.password}
                  type={InputType.PASSWORD}
                  updateType="password"
                  containerStyle="mt-4"
                  labelTitle={t('Account.input.password')}
                  updateFormValue={updateFormValue}
                  errorState={errorMessage !== ''}
                />
              </div>

              <div className="text-right text-primary">
                <Link to="/forgot-password">
                  <span className="text-sm  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                    {t('Account.forgotPassword')}
                  </span>
                </Link>
              </div>

              <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
              <button
                type="submit"
                className={`btn mt-2 w-full btn-primary + ${
                  loading ? ' loading' : ''
                }`}
              >
                {t('LoginScreen.loginButton')}
              </button>

              <div className="text-center mt-4">
                {t('Account.noAccountText')}
                <NavLink to="/signup">
                  <span className="  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                    {t('Account.register')}
                  </span>
                </NavLink>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export the Login component.
export default Login;
