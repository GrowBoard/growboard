import { NavLink, Outlet, useLocation } from 'react-router-dom';

import { TooltipComponent } from '@components';
import { AddIcon, DeleteIcon, EditIcon, PreviewIcon } from '@assets';

import getSubNavTitle from '../../../../util/nav/NavTitle';

/**
 * Project screen routes.
 */
const ProjectRoutes = [
  { title: 'Project preview', icon: <PreviewIcon />, path: 'preview' },
  { title: 'Add project', icon: <AddIcon />, path: 'add' },
  { title: 'Edit project', icon: <EditIcon />, path: 'edit' },
  { title: 'Delete project', icon: <DeleteIcon />, path: 'delete' },
];

const ProjectsScreen = () => {
  const currentLocation = useLocation();

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
