import { SocialType } from '@service/supabase/supastore/user_profile/UserCollection';
import { FacebookIcon } from './FacebookIcon';
import { GithubIcon } from './GithubIcon';
import { InstagramIcon } from './InstagramIcon';
import { LinkedInIcon } from './LinkedInIcon';
import { WebsiteIcon } from './WebsiteIcon';
import { XIcon } from './XIcon';
import { YoutubeIcon } from './YoutubeIcon';

/**
 * Props for the Social Icon component.
 */
interface SocialIconProps {
  socialType: SocialType;
}

/**
 * Returns a social Icon using the social type.
 *
 * @param socialType
 * @returns
 */
export function SocialIcon(props: SocialIconProps) {
  switch (props.socialType) {
    case SocialType.Facebook:
      return <FacebookIcon />;
    case SocialType.Instagram:
      return <InstagramIcon />;
    case SocialType.Linkedin:
      return <LinkedInIcon />;
    case SocialType.X:
      return <XIcon />;
    case SocialType.Youtube:
      return <YoutubeIcon />;
    case SocialType.Github:
      return <GithubIcon />;
    default:
      return <WebsiteIcon />;
  }
}
