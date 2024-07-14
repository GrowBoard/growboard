import { create } from 'zustand';

import { immer } from 'zustand/middleware/immer';

import {
  createThemeSlice,
  createAlertSlice,
  createAuthSlice,
  createProjectsSlice,
  createImageModalSlice,
  createNotificationSlice,
} from '@store/slice';
import { AppStoreState } from './types';
import { createProfileSlice } from '../slice/Profile';

export const appStore = create<AppStoreState>()(
  immer((...api) => ({
    Theme: createThemeSlice(...api),
    Alert: createAlertSlice(...api),
    Auth: createAuthSlice(...api),
    Projects: createProjectsSlice(...api),
    ImageModal: createImageModalSlice(...api),
    Notification: createNotificationSlice(...api),
    Profile: createProfileSlice(...api),
  })),
);
