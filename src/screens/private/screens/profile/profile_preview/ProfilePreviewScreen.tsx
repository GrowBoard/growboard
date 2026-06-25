import {
  NameIcon,
  DateIcon,
  ExperienceIcon,
  ProfilePlaceholder,
  EmailIcon,
} from '@assets';
import { TitleCard } from '@components';
import {
  profileSelector,
  authNameSelector,
  authEmailSelector,
  authPictureSelector,
  useShallow,
} from '@selectors';
import { appStore } from '@store';

/**
 * The text style for the profile preview screen.
 */
const TextStyle =
  'text-md font-semibold mt-2 border border-gray-800 rounded-md p-3 flex flex-row items-center gap-3 bg-gray-850 text-white shadow-sm';

/**
 * Component definition for the profile preview screen.
 * @returns The profile preview screen component.
 */
function ProfilePreviewScreen() {
  const { profileData } = appStore(useShallow(profileSelector));
  const googleName = appStore(useShallow(authNameSelector));
  const googleEmail = appStore(useShallow(authEmailSelector));
  const googlePicture = appStore(useShallow(authPictureSelector));

  const displayName =
    googleName || `${profileData.firstName} ${profileData.lastName}` || 'User';
  const displayEmail = googleEmail || 'No email connected';
  const rawPicture = googlePicture || profileData.profilePicture;
  const displayPicture = rawPicture
    ? rawPicture.replace('s96-c', 's1028-c')
    : null;

  return (
    <div className="m-4 h-full">
      <TitleCard title="Profile Preview" topMargin="mt-2">
        <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto p-4">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
            {/* Left side: Profile Info */}
            <div className="grid grid-cols-1 gap-3 w-full md:w-2/3">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Account Information
              </div>
              <div className={TextStyle}>
                <NameIcon />{' '}
                <span className="text-xs text-gray-400 mr-1 uppercase">
                  Name:
                </span>{' '}
                {displayName}
              </div>
              <div className={TextStyle}>
                <EmailIcon />{' '}
                <span className="text-xs text-gray-400 mr-1 uppercase">
                  Email:
                </span>{' '}
                {displayEmail}
              </div>
              {profileData.phoneNumber && (
                <div className={TextStyle}>
                  <DateIcon />{' '}
                  <span className="text-xs text-gray-400 mr-1 uppercase">
                    Phone:
                  </span>{' '}
                  {profileData.phoneNumber}
                </div>
              )}
              {profileData.bio && (
                <div className={TextStyle}>
                  <ExperienceIcon />{' '}
                  <span className="text-xs text-gray-400 mr-1 uppercase">
                    Bio:
                  </span>{' '}
                  {profileData.bio}
                </div>
              )}
            </div>

            {/* Right side: Avatar */}
            <div className="flex flex-col items-center gap-3 w-full md:w-1/3">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Profile Photo
              </div>
              <div className="w-56 h-56 flex items-center justify-center rounded-full overflow-hidden border border-gray-800 bg-gray-850 shadow-md">
                {displayPicture ? (
                  <img
                    alt="Profile Avatar"
                    src={displayPicture}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="scale-150 text-gray-600">
                    <ProfilePlaceholder />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </TitleCard>
    </div>
  );
}

// Export the ProfilePreviewScreen component.
export default ProfilePreviewScreen;
