import {
  PageLoadingComponent,
  useSuccessToast,
  useErrorToast,
} from '@components';
import { appStore } from '@store';
import { profileSelector, authNameSelector, useShallow } from '@selectors';
import { useGetProfileData, useSaveProfileData } from '@services/hooks/private';
import { Box } from '@chakra-ui/react';
import { ProfileForm } from './components';

/**
 * ProfileSettingScreen Component.
 * The entry point for the profile settings tab, displaying a page loading loader
 * while fetching profile metadata, and then displaying the settings input form.
 *
 * @returns The ProfileSettingScreen component.
 */
const ProfileSettingScreen = () => {
  const { profileData } = appStore(useShallow(profileSelector));
  const name = appStore(useShallow(authNameSelector));

  const { isLoading } = useGetProfileData();
  const saveMutation = useSaveProfileData();

  const successToast = useSuccessToast();
  const errorToast = useErrorToast();

  // Conditioned sub-form component to initialize TanStack Form only when data is ready
  if (isLoading) {
    return <PageLoadingComponent />;
  }

  return (
    <Box m={2} overflowY="auto">
      <ProfileForm
        initialData={profileData}
        name={name}
        saveMutation={saveMutation}
        successToast={successToast}
        errorToast={errorToast}
      />
    </Box>
  );
};

export default ProfileSettingScreen;
