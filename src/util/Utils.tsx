import {
  SocialLink,
  SocialType,
} from '@service/supabase/supastore/user_profile/UserCollection';

/**
 * Get social links from the user profile data.
 *
 * @param links  The social links.
 * @param type  The social type.
 * @returns The social link.
 */
function getSocialMediaLink(links: Array<SocialLink>, type: SocialType) {
  return links.find((socialLink) => socialLink.type === type)?.link || '';
}

// Export the getSocialMediaLink function.
export { getSocialMediaLink };
