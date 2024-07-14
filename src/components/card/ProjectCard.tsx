import { NavLink } from 'react-router-dom';
import { ProjectCardProps } from './types';
import { useTranslation } from 'react-i18next';

/**
 * Project card component.
 * @param propsData The project card props.
 * @returns The project card component.
 */
const ProjectCard = ({ data }: ProjectCardProps) => {
  const { t } = useTranslation();
  const {
    image,
    title,
    description,
    icon,
    isLive,
    projectLiveLink,
    githubLink,
    completed,
    path,
  } = data;
  return (
    <div className="card w-[360px] bg-base-100 shadow-xl outline-double">
      <figure>
        {image ? (
          <img src={image} alt={title} loading="lazy" />
        ) : (
          <div className="skeleton w-[360px] h-[200px] mx-2 mt-2"></div>
        )}
      </figure>
      <div className="card-body">
        <div className="flex flex-row justify-between items-center p-2 drop-shadow-lg border rounded-xl">
          <TitleAndLiveBadge
            title={title}
            isLive={isLive}
            liveLink={projectLiveLink}
          />
          {icon ? (
            <img src={icon} alt={title} className="w-10 h-10" />
          ) : (
            <div className="skeleton w-16 h-16 rounded-full"></div>
          )}
        </div>
        <p>{description}</p>
        <div className="flex flex-row items-center justify-between">
          <progress
            className="progress progress-primary w-[80%] mt-2"
            value={completed}
            max="100"
          ></progress>
          <div className="text-primary text-lg font-semibold">{completed}%</div>
        </div>
        <div className="card-actions justify-between mt-2 ">
          <a
            href={githubLink}
            target="_blank"
            className="btn btn-outline"
            rel="noreferrer"
          >
            {t('ProjectCard.projectLink')}
          </a>
          <NavLink to={path} className="btn btn-outline btn-primary">
            {t('ProjectCard.projectPreview')}
          </NavLink>
        </div>
      </div>
    </div>
  );
};

// Title and live badge internal component.
function TitleAndLiveBadge(props: {
  title: string;
  isLive: boolean;
  liveLink: string;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-row justify-start items-center">
      <h2 className="card-title">
        <a
          href={`http://${props.liveLink}`}
          target="_blank"
          rel="noreferrer"
          className=" hover:text-primary hover: duration-75"
        >
          {props.title}
        </a>
      </h2>
      <div>
        {props.isLive && (
          <span className="badge badge-success animate-pulse duration-75 m-1">
            {t('ProjectCard.liveStatus')}
          </span>
        )}
      </div>
    </div>
  );
}

export default ProjectCard;
