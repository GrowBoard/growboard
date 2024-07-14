import { NavLink, Outlet, useLocation } from 'react-router-dom';
import getSubNavTitle from '../../../../util/nav/NavTitle';
import { OverviewIcon, DeleteIcon, AddIcon, EditIcon } from '@assets';
import { TooltipComponent } from '@dash-ui';
import { CredsScreenProps } from './types';

const CredsRoutes = [
  { title: 'Credentials over', icon: <OverviewIcon />, path: 'preview' },
  { title: 'Credentials add', icon: <AddIcon />, path: 'add' },
  { title: 'Credentials edit', icon: <EditIcon />, path: 'edit' },
  { title: 'Delete credentials', icon: <DeleteIcon />, path: 'delete' },
];

/**
 * Component definition for the creds screen component.
 * @param props The props for the creds screen component.
 * @returns The creds screen component.
 */
const CredsScreen = (props: CredsScreenProps) => {
  const currentLocation = useLocation();
  return (
    <div className="h-full">
      <div className=" m-2 bg-primary-content p-1 drop-shadow-md rounded-lg flex flex-row justify-between items-center">
        <div className="text-xl font-semibold mx-4">
          {getSubNavTitle(currentLocation.pathname)}
        </div>
        <div className="flex flex-row space-x-2 gap-3">
          {CredsRoutes.map((item, index) => (
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

export default CredsScreen;
