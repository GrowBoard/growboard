import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { TooltipComponent } from '@components';
import getSubNavTitle from '../../../../util/nav/NavTitle';
import { OverviewIcon, DeleteIcon, AddIcon, EditIcon } from '@assets';

/**
 * Props for the PlansScreen component.
 */
interface IPlansScreenProps {}

/**
 * Plans screen routes.
 */
const PlansRoutes = [
  { title: 'Plans overview', icon: <OverviewIcon />, path: 'preview' },
  { title: 'Add plan', icon: <AddIcon />, path: 'add' },
  { title: 'Edit plan', icon: <EditIcon />, path: 'edit' },
  { title: 'Delete plan', icon: <DeleteIcon />, path: 'delete' },
];

/**
 * Component definition for the plans screen component.
 * @param props The props for the plans screen component.
 * @returns The plans screen component.
 */
function PlansScreen(props: IPlansScreenProps) {
  const currentLocation = useLocation();
  return (
    <div className="h-full">
      <div className=" m-2 bg-primary-content p-1 drop-shadow-md rounded-lg flex flex-row justify-between items-center">
        <div className="text-xl font-semibold mx-4">
          {getSubNavTitle(currentLocation.pathname)}
        </div>
        <div className="flex flex-row space-x-2 gap-3">
          {PlansRoutes.map((item, index) => (
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
}

// Export the PlansScreen component.
export default PlansScreen;
export type { IPlansScreenProps };
