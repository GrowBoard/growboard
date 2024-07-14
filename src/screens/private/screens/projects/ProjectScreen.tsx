import { useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

import { TooltipComponent } from '@dash-ui';
import { getAllProjects } from '@service/supabase/supastore/projects/ProjectsStoreApi';
import { AddIcon, DeleteIcon, EditIcon, PreviewIcon } from '@assets';
import { appStore } from '@store';
import { authSelector, projectsSelector, useShallow } from '@selectors';

import getSubNavTitle from '../../../../util/nav/NavTitle';

/**
 * Props for the ProjectsScreen component.
 */
interface IProjectsScreenProps {}

/**
 * Project screen routes.
 */
const ProjectRoutes = [
  { title: 'Project preview', icon: <PreviewIcon />, path: 'preview' },
  { title: 'Add project', icon: <AddIcon />, path: 'add' },
  { title: 'Edit project', icon: <EditIcon />, path: 'edit' },
  { title: 'Delete project', icon: <DeleteIcon />, path: 'delete' },
];

const ProjectsScreen = (props: IProjectsScreenProps) => {
  const currentLocation = useLocation();
  const { userId } = appStore(useShallow(authSelector));
  const { addProjects } = appStore(useShallow(projectsSelector));

  useEffect(() => {
    getAllProjects(userId, (projectsData) => addProjects(projectsData));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <div className="h-full">
      <div className=" m-2 bg-primary-content p-1 drop-shadow-md rounded-lg flex flex-row justify-between items-center">
        <div className="text-xl font-semibold mx-4">
          {getSubNavTitle(currentLocation.pathname)}
        </div>
        <div className="flex flex-row space-x-2 gap-3">
          {ProjectRoutes.map((item, index) => (
            <TooltipComponent key={index} title={item.title}>
              <NavLink to={item.path} className="btn btn-square btn-outline ">
                {item.icon}
              </NavLink>
            </TooltipComponent>
          ))}
        </div>
      </div>
      <div className="overflow-scroll h-[90%]">
        <Outlet />
      </div>
    </div>
  );
};

// Export the ProjectsScreen component.
export default ProjectsScreen;
export type { IProjectsScreenProps };
