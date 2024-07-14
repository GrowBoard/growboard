import { useEffect } from 'react';
import { alreadySignedIn } from '@service/supabase/supa_auth/AuthApi';
import { AlreadyLoginServiceProviderProps } from './types';
import { appStore } from '@store';
import { authSelector, useShallow } from '@selectors';

const AlreadyLoginServiceProvider = (
  props: AlreadyLoginServiceProviderProps,
) => {
  const { removeLoginData } = appStore(useShallow(authSelector));

  const signOutHandler = () => {
    removeLoginData();
  };

  useEffect(() => {
    alreadySignedIn(signOutHandler);
  });
  return <div>{props.children}</div>;
};

export default AlreadyLoginServiceProvider;
