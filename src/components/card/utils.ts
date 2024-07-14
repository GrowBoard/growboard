import { ProjectData } from '@service/supabase/supastore/projects/ProjectsCollection';
import { ProjectCardData } from './types';

/**
 * Get the project card data.
 * @param project The project data.
 * @returns The project card data.
 */
export function getProjectCardData(project: ProjectData): ProjectCardData {
  return {
    title: project.projectName,
    description: project.projectDesc,
    icon: project.projectIcon,
    image: project.images && project.images.length > 0 ? project.images[0] : '',
    path: 'preview/' + project.projectId,
    projectLiveLink: project.projectLink,
    githubLink: project.githubLink,
    isLive: project.isLive,
    completed: project.projectCompleted,
  };
}
