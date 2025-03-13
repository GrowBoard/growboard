import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { NavigationComponent, SidebarComponent } from '@components';
import { appStore } from '@store';
import { removeAuthDataSelector, useShallow } from '@selectors';

const MainRootScreen = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const removeAuthData = appStore(useShallow(removeAuthDataSelector));
  const logOutClickHandler = removeAuthData;

  const openSidebarClickHandler = () => {
    setSidebarOpen((prev) => !prev);
  };
  return (
    <div className="flex flex-col h-screen -z-10">
      <div className="z-10">
        <NavigationComponent
          logOutClickHandler={logOutClickHandler}
          openSidebarClickHandler={openSidebarClickHandler}
        />
      </div>
      <div className=" flex flex-wrap h-[92%] w-full">
        <div
          className={`${
            sidebarOpen ? 'w-1/6' : 'w-[5%]'
          } h-full border-r border-primary bg-base-200`}
        >
          <SidebarComponent sideBarOpen={sidebarOpen} />
        </div>
        <div
          className={`${
            sidebarOpen ? 'w-5/6' : 'w-[95%]'
          } h-full p-4 drop-shadow-lg`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainRootScreen;
