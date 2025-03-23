import { StateCreator } from 'zustand';
import {
  ThemeStateSlice,
  AlertStateSlice,
  AuthStateSlice,
  ProjectStateSlice,
  ImageModalStateSlice,
  NotificationStateSlice,
  ProfileStateSlice,
  ExpenseStateSlice,
} from '@store/slice';
import {} from '../slice/User/types';

export interface AppStoreState {
  Theme: ThemeStateSlice;
  Alert: AlertStateSlice;
  Auth: AuthStateSlice;
  Projects: ProjectStateSlice;
  Expense: ExpenseStateSlice;
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
