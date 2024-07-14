import { SupabaseProjectsDB } from '../../../supabase_main/Supabase';
import { ProjectData, ProjectDataSchema } from '../ProjectsCollection';

/**
 * Method to get the all project data.
 *
 * @param userId - The user id.
 * @param successCallback - The success callback function.
 * @returns The projects data.
 */
async function getAllProjectForMainScreen(
  userId: string,
  successCallback: (projects: ProjectData[]) => void,
) {
  try {
    const { data, error } = await SupabaseProjectsDB.select('*')
      .eq('user_id', userId)
      .order('started_on', { ascending: false });
    if (data !== null && data.length > 0 && data !== undefined && !error) {
      const projects = getProjectsDateFromMultipleResponse(data);
      successCallback(projects);
    }
  } catch (error) {
    console.log(error);
  }
  return [];
}

/**
 * Method to get the project data.
 *
 * @param projects - The project data.
 * @returns The project data.
 */
function getProjectsDateFromMultipleResponse(
  projects: ProjectDataSchema[],
): ProjectData[] {
  const projectData: ProjectData[] = [];
  projects.forEach((project) => {
    projectData.push(getProjectDataFromSingleResponse(project));
  });
  return projectData;
}

/**
 * Method to get the single project data.
 *
 * @param projects - The project data.
 * @returns The project data.
 */
async function getProjectUsingProjectId(projectId: string) {
  try {
    const { data, error } = await SupabaseProjectsDB.select('*')
      .eq('project_id', projectId)
      .single();
    if (data !== null && data.length > 0 && data !== undefined && !error) {
      const project = getProjectDataFromSingleResponse(data);
      return project;
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * Method to get the project data.
 *
 * @param projects - The project data.
 * @returns The project data.
 */
function getProjectDataFromSingleResponse(
  project: ProjectDataSchema,
): ProjectData {
  const projectData: ProjectData = {
    projectId: project.project_id,
    userId: project.user_id,
    projectName: project.project_name,
    projectDesc: project.project_desc,
    projectIcon: project.project_icon,
    techUsed: project.tech_used?.data,
    projectLink: project.project_link,
    githubLink: project.github_link,
    hostingerLink: project.hostinger_link,
    images: project.images?.data,
    isLive: project.is_live,
    relatedIdeas: project.related_ideas?.data,
    startedOn: project.started_on,
    features: project.features?.data,
    todos: project.todos?.data,
    projectCompleted: project.project_completed,
    backendLink: project.backend_link,
  };

  return projectData;
}

// Export the functions
export { getAllProjectForMainScreen, getProjectUsingProjectId };
