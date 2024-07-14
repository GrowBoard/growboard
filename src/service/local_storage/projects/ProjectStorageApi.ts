import { ProjectData } from '../../supabase/supastore/projects/ProjectsCollection';
import { ProjectsKey } from '../token_constants/StorageConstant';

/**
 * Method to store the projects key in local storage
 */
function storeProjectsKeyData(projectsData: ProjectData[]) {
  localStorage.setItem(ProjectsKey, JSON.stringify(projectsData));
}

/**
 * Method to get the profile key from local storage
 */
function getProjectsKeyData(): ProjectData[] | null {
  const projectsData = localStorage.getItem(ProjectsKey);
  const projects: ProjectData[] = projectsData
    ? JSON.parse(projectsData)
    : null;
  if (projects !== null && projects.length > 0) {
    return projects;
  }
  console.log('Profile data not found');
  return null;
}

/**
 * Method to remove the projects key data from local storage
 */
function removeProjectsKeyData() {
  localStorage.removeItem(ProjectsKey);
}

// Export the functions
export { storeProjectsKeyData, getProjectsKeyData, removeProjectsKeyData };
