import { PageLoadingComponent, TitleCard } from '@components';

import {
  FacebookIcon,
  InstagramIcon,
  GithubIcon,
  LinkedInIcon,
  XIcon,
  WebsiteIcon,
} from '@assets';
import { InputText, InputType } from '@components';
import { appStore } from '@store';
import { profileSelector, useShallow } from '@selectors';

/**
 * Type definition for the update form value.
 */
interface UpdateFormValue {
  updateType: string;
  value: string;
}

/**
 * The profile setting screen component.
 * @returns The ProfileSettingScreen component.
 */
function ProfileSettingScreen() {
  const { profileData, updateProfile } = appStore(useShallow(profileSelector));

  const updateFormValue = ({ updateType, value }: UpdateFormValue) => {
    updateProfile({ ...profileData, [updateType]: value });
  };

  return (
    <div className="m-2 overflow-scroll">
      {false && <PageLoadingComponent />}
      <TitleCard
        title="Profile Settings"
        topMargin="mt-2"
        TopSideButtons={<></>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputText
            type={InputType.TEXT}
            labelTitle="First name"
            defaultValue={profileData.firstName}
            updateType="fname"
            updateFormValue={updateFormValue}
          />
          <InputText
            type={InputType.TEXT}
            labelTitle="Last name"
            defaultValue={profileData.lastName}
            updateType="lname"
            updateFormValue={updateFormValue}
          />
          <InputText
            type={InputType.TEXT}
            labelTitle="Bio"
            updateType="bio"
            defaultValue={profileData.bio}
            updateFormValue={updateFormValue}
          />
          <InputText
            type={InputType.NUMBER}
            labelTitle="Phone Number"
            updateType="phoneNumber"
            defaultValue={profileData.phoneNumber}
            updateFormValue={updateFormValue}
          />
          <div className=" flex flex-col item-center">
            <label className="label">
              <span className="label-text">Profile Picture</span>
            </label>
            <input
              type="file"
              className="file-input w-full max-w-xs border border-base-300"
            />
          </div>
        </div>
        <div className="divider"></div>
        <div className={`text-xl font-semibold inline-block`}>Social Links</div>
        <div className="divider col-span-2"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-row justify-center items-end">
            <IconBorderProvider children={<FacebookIcon />} />
            <InputText
              labelTitle="Facebook"
              defaultValue={profileData.facebook}
              updateType="facebook"
              updateFormValue={updateFormValue}
            />
          </div>
          <div className="flex flex-row justify-center items-end">
            <IconBorderProvider children={<InstagramIcon />} />
            <InputText
              labelTitle="Instagram"
              defaultValue={profileData.instagram}
              updateType="instagram"
              updateFormValue={updateFormValue}
            />
          </div>
          <div className="flex flex-row justify-center items-end">
            <IconBorderProvider children={<GithubIcon />} />
            <InputText
              labelTitle="Github"
              defaultValue={profileData.github}
              updateType="github"
              updateFormValue={updateFormValue}
            />
          </div>
          <div className="flex flex-row justify-center items-end">
            <IconBorderProvider children={<LinkedInIcon />} />
            <InputText
              labelTitle="LinkedIn"
              defaultValue={profileData.linkedin}
              updateType="linkedin"
              updateFormValue={updateFormValue}
            />
          </div>
          <div className="flex flex-row justify-center items-end">
            <IconBorderProvider children={<XIcon />} />
            <InputText
              labelTitle="X(Twitter)"
              defaultValue={profileData.twitter}
              updateType="x"
              updateFormValue={updateFormValue}
            />
          </div>

          <div className="flex flex-row justify-center items-end">
            <IconBorderProvider children={<WebsiteIcon />} />
            <InputText
              labelTitle="Website"
              defaultValue={profileData.website}
              updateType="website"
              updateFormValue={updateFormValue}
            />
          </div>
        </div>
      </TitleCard>
    </div>
  );
}

function IconBorderProvider(props: { children: any }) {
  return (
    <div className="btn btn-square mx-1 drop-shadow-md">{props.children}</div>
  );
}

// Export the ProfileSettingScreen component.
export default ProfileSettingScreen;
