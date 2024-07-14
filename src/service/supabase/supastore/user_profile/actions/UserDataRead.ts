import { UserData } from '@store';
import { SupabaseUsersDB } from '../../../supabase_main/Supabase';
import { SocialLink, SocialType, UserProfileData } from '../UserCollection';

/**
 * Method to get the user profileData
 *
 * @param userAuthState - The user auth data.
 * @param callback - The callback function.
 * @returns The user data.
 */
async function getUserUsingId(
  userAuthState: UserData,
  callback: (user: UserProfileData) => void,
) {
  try {
    const { data, error } = await SupabaseUsersDB.select('*')
      .eq('id', userAuthState.userId)
      .single();
    if (data !== null && data.length > 0 && data !== undefined && !error) {
      const user = getProfDataFromResponseSchema(data);
      callback(user);
      return;
    }

    const { data: dataUser, error: regisError } = await SupabaseUsersDB.upsert({
      id: userAuthState.userId,
      email: userAuthState.email,
      first_name: userAuthState.firstName,
      last_name: userAuthState.lastName,
    })
      .select()
      .single();

    if (regisError) {
      console.log(regisError);
    } else {
      console.log(dataUser);
      const user = getProfDataFromResponseSchema(dataUser);
      callback(user);
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * Method to get the user profileData.
 *
 * @param user - The user data.
 * @returns The user data.
 */
function getProfDataFromResponseSchema(user: any): UserProfileData {
  const profData: UserProfileData = {
    userId: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    profile: user.profile_image,
    email: user.email,
    place: user.place,
    dateOfBirth: user.dob,
    designation: user.designation,
    yearOfExp: user.yoe,
    socialLinks: new Array<SocialLink>(
      {
        type: SocialType.Facebook,
        link: user.social_fb,
      },
      {
        type: SocialType.Instagram,
        link: user.social_insta,
      },
      {
        type: SocialType.X,
        link: user.social_x,
      },
      {
        type: SocialType.Github,
        link: user.social_git,
      },
      {
        type: SocialType.Linkedin,
        link: user.social_li,
      },
      {
        type: SocialType.Website,
        link: user.social_web,
      },
      {
        type: SocialType.Youtube,
        link: user.social_yt,
      },
    ),
  };
  return profData;
}

// Export the function
export { getUserUsingId };
