import { FacebookIcon } from './FacebookIcon';
import { GithubIcon } from './GithubIcon';
import { InstagramIcon } from './InstagramIcon';
import { LinkedInIcon } from './LinkedInIcon';
import { WebsiteIcon } from './WebsiteIcon';
import { XIcon } from './XIcon';
import { YoutubeIcon } from './YoutubeIcon';

/**
 * Returns a social Icon using the social type.
 *
 * @param socialType
 * @returns
 */
export function SocialIcon({ type }: { type: string }) {
  switch (type) {
    case 'facebook':
      return <FacebookIcon />;
    case 'instagram':
      return <InstagramIcon />;
    case 'linkedin':
      return <LinkedInIcon />;
    case 'twitter':
      return <XIcon />;
    case 'youtube':
      return <YoutubeIcon />;
    case 'github':
      return <GithubIcon />;
    default:
      return <WebsiteIcon />;
  }
}
