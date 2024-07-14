import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ErrorText, InputText, LandingIntro } from '@dash-ui';
import { SignUpCred } from '@service/supabase/supa_auth/actions/AuthSignUp';
import { signUp } from '@service/supabase/supa_auth/AuthApi';
import { getSuccessAlertData } from '@provider';
import { useTranslation } from 'react-i18next';
import { appStore } from '@store';
import { alertSelector, useShallow } from '@selectors';

/**
 * Prop types for the update form value function.
 */
interface UpdateProps {
  updateType: string;
  value: string;
}

/**
 * Component definition for the register screen.
 *
 * @returns The Register component.
 */
function Register() {
  const { t } = useTranslation();
  const INITIAL_REGISTER_OBJ: SignUpCred = {
    fName: '',
    lName: '',
    password: '',
    email: '',
  };
  const { showAlertWithTimeout } = appStore(useShallow(alertSelector));

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [registerObj, setRegisterObj] = useState(INITIAL_REGISTER_OBJ);

  const signUpHandler = () => {
    showAlertWithTimeout(
      getSuccessAlertData(t('SignUpScreen.successfulAlert')),
      3000,
    );
    navigate('login');
  };

  const submitForm = (e: any) => {
    e.preventDefault();
    setErrorMessage('');

    if (registerObj.fName.trim() === '')
      return setErrorMessage(t('SignUpError.firstNameRequired'));
    if (registerObj.lName.trim() === '')
      return setErrorMessage(t('SignUpError.lastNameRequired'));
    if (registerObj.email.trim() === '')
      return setErrorMessage(t('SignUpError.emailRequired'));
    if (registerObj.password.trim() === '')
      return setErrorMessage(t('SignUpError.emailNotValid'));
    else {
      setLoading(true);
      // Show alert
      signUp(registerObj, signUpHandler, (error: string) => {
        setErrorMessage(error);
      });
      setLoading(false);
    }
  };

  const updateFormValue = ({ updateType, value }: UpdateProps) => {
    setErrorMessage('');
    setRegisterObj({ ...registerObj, [updateType]: value });
  };

  return (
    <div
      className="h-screen bg-base-200 flex items-center"
      style={{
        backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
        backgroundSize: 'cover',
      }}
    >
      <div className="card mx-auto w-full max-w-5xl shadow-xl">
        <div className="grid md:grid-cols-2 grid-cols-1">
          <div className="glass rounded-l-2xl">
            <LandingIntro />
          </div>
          <div className="py-12 px-10 bg-primary-content">
            <h2 className="text-2xl font-semibold mb-2 text-center">
              {t('SignUpScreen.title')}
            </h2>
            <form onSubmit={(e) => submitForm(e)}>
              <div className="">
                <InputText
                  defaultValue={registerObj.fName}
                  updateType="fName"
                  containerStyle="mt-4"
                  labelTitle={t('Account.input.firstName')}
                  updateFormValue={updateFormValue}
                />

                <InputText
                  defaultValue={registerObj.lName}
                  updateType="lName"
                  containerStyle="mt-2"
                  labelTitle={t('Account.input.lastName')}
                  updateFormValue={updateFormValue}
                />
                <InputText
                  defaultValue={registerObj.email}
                  updateType="email"
                  containerStyle="mt-2"
                  labelTitle={t('Account.input.email')}
                  updateFormValue={updateFormValue}
                />

                <InputText
                  defaultValue={registerObj.password}
                  updateType="password"
                  containerStyle="mt-2"
                  labelTitle={t('Account.input.password')}
                  updateFormValue={updateFormValue}
                />
              </div>

              <ErrorText styleClass="mt-2">{errorMessage}</ErrorText>
              <button
                type="submit"
                className={
                  'btn mt-2 w-full btn-primary' + (loading ? ' loading' : '')
                }
              >
                {t('SignUpScreen.registerButton')}
              </button>

              <div className="text-center mt-2">
                {t('Account.noAccountText')}
                <NavLink to="/login">
                  <span className="  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                    {t('Account.login')}
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

// Export the Register component.
export default Register;
