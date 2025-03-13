import {
  NameIcon,
  DateIcon,
  ExperienceIcon,
  ProfilePlaceholder,
  SocialIcon,
} from '@assets';
import { TitleCard, TooltipComponent } from '@components';
import { profileSelector, useShallow } from '@selectors';
import { appStore, UserSocialData } from '@store';

/**
 * The text style for the profile preview screen.
 */
const TextStyle =
  'text-lg font-semibold mt-2 outline rounded-md p-2 flex flex-row items-center gap-2';

/**
 * Component definition for the profile preview screen.
 * @returns The profile preview screen component.
 */
function ProfilePreviewScreen() {
  const { profileData } = appStore(useShallow(profileSelector));

  return (
    <div className=" m-2 h-full">
      <TitleCard title="Profile preview" topMargin="mt-2">
        <div className="grid grid-cols-1">
          <div className="flex flex-row items-start justify-between">
            <div className="grid grid-cols-1 m-auto">
              <div className={TextStyle}>
                <NameIcon /> {profileData.firstName} {profileData.lastName}
              </div>
              <div className={TextStyle}>
                <DateIcon /> {profileData.phoneNumber}
              </div>
              <div className={TextStyle}>
                <ExperienceIcon /> {profileData.bio}
              </div>
            </div>
            <div className="divider divider-horizontal"></div>
            <div className="w-64 h-64 items-center mx-auto rounded-full bg-base-200 btn btn-square btn-outline">
              {profileData.profilePicture === '' ? (
                <div className=" scale-150">
                  <ProfilePlaceholder />
                </div>
              ) : (
                <img
                  alt="Tailwind CSS Navbar component"
                  src={profileData.profilePicture}
                />
              )}
            </div>
          </div>
        </div>
        <div className="divider"></div>
        <div className=" flex flex-row justify-evenly w-full ">
          <GetSocialLink socialLinksMap={profileData} />
        </div>
      </TitleCard>
    </div>
  );
}

// Interface type definition for the social link props.
interface SocialLinkProps {
  socialLinksMap: UserSocialData;
}

/**
 * Get the social media link.
 * @param props The social link props.
 * @returns The social media link.
 */
function GetSocialLink({ socialLinksMap }: SocialLinkProps) {
  return (
    <>
      {Object.entries(socialLinksMap).map(([type, link]) => {
        const disabled = link === '';
        return (
          <TooltipComponent title={type} disable={disabled} key={type}>
            <a
              href={link}
              className={`btn btn-ghost btn-square ${
                disabled ? ' btn-disabled bg-blend-overlay opacity-50' : ''
              }`}
            >
              <SocialIcon type={type} />
            </a>
          </TooltipComponent>
        );
      })}
    </>
  );
}

// Export the ProfilePreviewScreen component.
export default ProfilePreviewScreen;
