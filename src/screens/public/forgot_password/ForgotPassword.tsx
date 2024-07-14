import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { forgotPassword } from '@service/supabase/supa_auth/AuthApi';
import { validateEmail } from '../../../util/input/Input';
import { ErrorText, InputText, InputType, LandingIntro } from '@dash-ui';
import { useTranslation } from 'react-i18next';

/**
 * Update props.
 */
interface UpdateProps {
  updateType: string;
  value: string;
}

/**
 * Register object type.
 */
interface RegisterObjType {
  emailId: string;
}

/**
 * The forgot password screen component.
 * @returns The ForgotPassword component.
 */
function ForgotPassword() {
  const { t } = useTranslation();
  const INITIAL_USER_OBJ: RegisterObjType = {
    emailId: '',
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [linkSent, setLinkSent] = useState(false);
  const [userObj, setUserObj] = useState(INITIAL_USER_OBJ);

  const forgotPasswordHandler = () => {
    setLoading(false);
    setLinkSent(true);
  };

  const submitForm = (e: any) => {
    e.preventDefault();
    setErrorMessage('');

    if (userObj.emailId.trim() === '')
      return setErrorMessage(t('ForgotPasswordError.emailRequired'));
    else if (!validateEmail(userObj.emailId)) {
      return setErrorMessage(t('ForgotPasswordError.emailNotValid'));
    } else {
      setLoading(true);
      forgotPassword(
        userObj.emailId,
        forgotPasswordHandler,
        (error: string) => {
          setErrorMessage(error);
        },
      );
      // Call API to send password reset link
    }
  };

  const updateFormValue = ({ updateType, value }: UpdateProps) => {
    setErrorMessage('');
    setUserObj({ ...userObj, [updateType]: value });
  };

  return (
    <div
      className="min-h-screen bg-base-200 flex items-center"
      style={{
        backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
        backgroundSize: 'cover',
      }}
    >
      <div className="card mx-auto w-full max-w-5xl shadow-xl">
        <div className="grid  md:grid-cols-2 grid-cols-1 rounded-xl">
          <div className="glass rounded-l-2xl">
            <LandingIntro />
          </div>
          <div className="py-24 px-10 bg-primary-content">
            <h2 className="text-2xl font-semibold mb-2 text-center">
              {t('ForgotPasswordScreen.title')}
            </h2>

            {linkSent && (
              <>
                <p className="my-4 text-xl font-bold text-center">
                  {t('ForgotPasswordScreen.linkSent')}
                </p>
                <p className="mt-4 mb-8 font-semibold text-center">
                  {t('ForgotPasswordScreen.checkEmailText')}
                </p>
                <div className="text-center mt-4">
                  <NavLink to="/login">
                    <button className="btn btn-block btn-primary ">
                      {t('Account.login')}
                    </button>
                  </NavLink>
                </div>
              </>
            )}

            {!linkSent && (
              <>
                <p className="my-8 font-semibold text-center">
                  {t('ForgotPasswordScreen.passwordResetLinkText')}
                </p>
                <form onSubmit={(e) => submitForm(e)}>
                  <div className="mb-4">
                    <InputText
                      type={InputType.EMAIL}
                      defaultValue={userObj.emailId}
                      updateType="emailId"
                      containerStyle="mt-4"
                      labelTitle={t('Account.input.email')}
                      updateFormValue={updateFormValue}
                    />
                  </div>

                  <ErrorText styleClass="mt-12">{errorMessage}</ErrorText>
                  <button
                    type="submit"
                    className={
                      'btn mt-2 w-full btn-primary' +
                      (loading ? ' loading' : '')
                    }
                  >
                    {t('ForgotPasswordScreen.sendResetLink')}
                  </button>

                  <div className="text-center mt-4">
                    {t('Account.noAccountText')}
                    <NavLink to="/register">
                      <button className="  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                        {t('Account.register')}
                      </button>
                    </NavLink>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Export the ForgotPassword component.
export default ForgotPassword;
