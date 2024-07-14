import { StateCreator } from 'zustand';
import {
  ThemeStateSlice,
  AlertStateSlice,
  AuthStateSlice,
  ProjectStateSlice,
  ImageModalStateSlice,
  NotificationStateSlice,
  ProfileStateSlice,
} from '@store/slice';
import {} from '../slice/Profile/types';

export interface AppStoreState {
  Theme: ThemeStateSlice;
  Alert: AlertStateSlice;
  Auth: AuthStateSlice;
  Projects: ProjectStateSlice;
  ImageModal: ImageModalStateSlice;
  Notification: NotificationStateSlice;
  Profile: ProfileStateSlice;
}

export type AppStoreSlice<T> = StateCreator<
  AppStoreState,
  [['zustand/immer', never]],
  [],
  T
>;
