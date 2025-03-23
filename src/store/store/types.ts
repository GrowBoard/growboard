import { StateCreator } from 'zustand';
import {
  AlertStateSlice,
  AuthStateSlice,
  ProjectStateSlice,
  ImageModalStateSlice,
  ProfileStateSlice,
  ExpenseStateSlice,
} from '@store/slice';
import {} from '../slice/User/types';

export interface AppStoreState {
  Alert: AlertStateSlice;
  Auth: AuthStateSlice;
  Projects: ProjectStateSlice;
  Expense: ExpenseStateSlice;
  ImageModal: ImageModalStateSlice;
  Profile: ProfileStateSlice;
}

export type AppStoreSlice<T> = StateCreator<
  AppStoreState,
  [['zustand/immer', never]],
  [],
  T
>;
