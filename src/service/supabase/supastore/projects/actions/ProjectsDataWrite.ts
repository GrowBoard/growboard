import {
  ToastAlertData,
  getErrorAlertData,
  getSuccessAlertData,
} from '@provider';
import { SupabaseProjectsDB } from '../../../supabase_main/Supabase';
import {
  ProjectData,
  ProjectDataSchema as ProjectSchemaData,
} from '../ProjectsCollection';

/**
 * Method to insert the single project data.
 *
 * @param projectData  - The project data.
 * @param alertCallback  - The alert callback function.
 */
async function insertOrUpdateProject(
  projectData: ProjectData,
  showAlertHandler: (toastAlertData: ToastAlertData) => void,
) {
  try {
    const { error } = await SupabaseProjectsDB.upsert([
      getProjectSchema(projectData),
    ]);
    if (error) {
      showAlertHandler(
        getErrorAlertData('Error while adding the project data'),
      );
    } else {
      showAlertHandler(
        getSuccessAlertData('Successfully updated the project data'),
      );
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * private method to get the project data.
 *
 * @param projects - The project data.
 * @returns The project data.
 */
function getProjectSchema(project: ProjectData): ProjectSchemaData {
  const projectSchemaData: ProjectSchemaData = {
    project_id: project.projectId,
    user_id: project.userId,
    project_name: project.projectName,
    project_desc: project.projectDesc,
    project_icon: project.projectIcon,
    tech_used: {
      data: project.techUsed,
    },
    project_link: project.projectLink,
    github_link: project.githubLink,
    hostinger_link: project.hostingerLink,
    images: {
      data: project.images,
    },
    is_live: project.isLive,
    related_ideas: {
      data: project.relatedIdeas,
    },
    started_on: project.startedOn,
    features: {
      data: project.features,
    },
    todos: {
      data: project.todos,
    },
    project_completed: project.projectCompleted,
    backend_link: project.backendLink,
  };
  return projectSchemaData;
}

// Export the functions
export { insertOrUpdateProject };
