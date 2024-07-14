import { Outlet } from 'react-router-dom';
import { signOut } from '@service/supabase/supa_auth/AuthApi';
import { useEffect, useState } from 'react';
import { NavigationComponent, SidebarComponent } from '@dash-ui';
import { appStore, syncForTheFirstTime } from '@store';
import { authSelector, profileSelector, useShallow } from '@selectors';

const MainRootScreen = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userId, removeLoginData } = appStore(useShallow(authSelector));
  const { removeProfile, updateProfile } = appStore(
    useShallow(profileSelector),
  );

  const logOutClickHandler = () => {
    signOut(() => {
      removeLoginData();
      removeProfile();
    });
  };

  useEffect(() => {
    if (userId === '') {
      logOutClickHandler();
    } else {
      console.log('syncing for the first time');
      const userData = syncForTheFirstTime((data) => updateProfile(data));
      if (userData) updateProfile(userData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

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
