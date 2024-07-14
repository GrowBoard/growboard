import {
  SocialLink,
  SocialType,
} from '@service/supabase/supastore/user_profile/UserCollection';
import { getSocialMediaLink } from '../../../../../util/Utils';
import {
  NameIcon,
  EmailIcon,
  PlaceIcon,
  TitleIcon,
  DateIcon,
  ExperienceIcon,
  ProfilePlaceholder,
  SocialIcon,
} from '@assets';
import { TitleCard, TooltipComponent } from '@dash-ui';
import { profileSelector, useShallow } from '@selectors';
import { appStore } from '@store';

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
                <EmailIcon /> {profileData.email}
              </div>
              <div className={TextStyle}>
                <PlaceIcon /> {profileData.place}
              </div>
              <div className={TextStyle}>
                <TitleIcon /> {profileData.designation}
              </div>
              <div className={TextStyle}>
                <DateIcon /> {profileData.dateOfBirth}
              </div>
              <div className={TextStyle}>
                <ExperienceIcon /> {profileData.yearOfExp} Years
              </div>
            </div>
            <div className="divider divider-horizontal"></div>
            <div className="w-64 h-64 items-center mx-auto rounded-full bg-base-200 btn btn-square btn-outline">
              {profileData.profile === '' ? (
                <div className=" scale-150">
                  <ProfilePlaceholder />
                </div>
              ) : (
                <img
                  alt="Tailwind CSS Navbar component"
                  src={profileData.profile}
                />
              )}
            </div>
          </div>
        </div>
        <div className="divider"></div>
        <div className=" flex flex-row justify-evenly w-full ">
          <GetSocialLink socialLinksMap={profileData.socialLinks} />
        </div>
      </TitleCard>
    </div>
  );
}

// Interface type definition for the social link props.
interface SocialLinkProps {
  socialLinksMap: Array<SocialLink>;
}

/**
 * Get the social media link.
 * @param props The social link props.
 * @returns The social media link.
 */
function GetSocialLink(props: SocialLinkProps) {
  const socialLinksMap: Array<SocialLink> = [
    {
      type: SocialType.Facebook,
      link: getSocialMediaLink(props.socialLinksMap, SocialType.Facebook),
    },
    {
      type: SocialType.Instagram,
      link: getSocialMediaLink(props.socialLinksMap, SocialType.Instagram),
    },
    {
      type: SocialType.Github,
      link: getSocialMediaLink(props.socialLinksMap, SocialType.Github),
    },
    {
      type: SocialType.X,
      link: getSocialMediaLink(props.socialLinksMap, SocialType.X),
    },
    {
      type: SocialType.Linkedin,
      link: getSocialMediaLink(props.socialLinksMap, SocialType.Linkedin),
    },
    {
      type: SocialType.Youtube,
      link: getSocialMediaLink(props.socialLinksMap, SocialType.Youtube),
    },
    {
      type: SocialType.Website,
      link: getSocialMediaLink(props.socialLinksMap, SocialType.Website),
    },
  ];

  return (
    <>
      {socialLinksMap.map(({ type, link }) => {
        const disabled = link === '';
        return (
          <TooltipComponent title={type} disable={disabled} key={type}>
            <a
              href={link}
              className={`btn btn-ghost btn-square ${
                disabled ? ' btn-disabled bg-blend-overlay opacity-50' : ''
              }`}
            >
              <SocialIcon socialType={type} />
            </a>
          </TooltipComponent>
        );
      })}
    </>
  );
}

// Export the ProfilePreviewScreen component.
export default ProfilePreviewScreen;
