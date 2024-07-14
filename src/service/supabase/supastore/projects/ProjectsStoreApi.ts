import { ToastAlertData } from '@provider';
import { ProjectData } from './ProjectsCollection';
import {
  getAllProjectForMainScreen,
  getProjectUsingProjectId,
} from './actions/ProjectsDataRead';
import { insertOrUpdateProject } from './actions/ProjectsDataWrite';

/**
 * Method to get the project data.
 *
 * @param projects - The project data.
 * @returns The project data.
 */
function getSingleProject(projectId: string) {
  return getProjectUsingProjectId(projectId);
}

/**
 * Method to get the all associated project data.
 *
 * @param userId - The user id.
 * @param successCallback - The success callback function.
 * @returns The project data.
 */
function getAllProjects(
  userId: string,
  successCallback: (projects: ProjectData[]) => void,
) {
  return getAllProjectForMainScreen(userId, successCallback);
}

/**
 * Method to add the new project data.
 *
 * @param projectData - The project data.
 * @param showAlertHandler - The notification function.
 */
function addNewProject(
  projectData: ProjectData,
  showAlertHandler: (toastAlertData: ToastAlertData) => void,
) {
  insertOrUpdateProject(projectData, showAlertHandler);
}

/**
 * Method to update the existing project data.
 *
 * @param projectData - The project data.
 * @param showAlertHandler - The notification function.
 */
function updateExistingProject(
  projectData: ProjectData,
  showAlertHandler: (toastAlertData: ToastAlertData) => void,
) {
  insertOrUpdateProject(projectData, showAlertHandler);
}

// Export the functions.
export {
  getSingleProject,
  getAllProjects,
  addNewProject,
  updateExistingProject,
};
