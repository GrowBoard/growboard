import { StateCreator } from 'zustand';
import {
  AuthStateSlice,
  ProjectStateSlice,
  ImageModalStateSlice,
  ProfileStateSlice,
  ExpenseStateSlice,
  CredsStateSlice,
  GoalsStateSlice,
  LearningsStateSlice,
  ResourcesStateSlice,
  PlansStateSlice,
} from '@store/slice';
import {} from '../slice/User/types';

export interface AppStoreState {
  Auth: AuthStateSlice;
  Projects: ProjectStateSlice;
  Expense: ExpenseStateSlice;
  ImageModal: ImageModalStateSlice;
  Profile: ProfileStateSlice;
  Creds: CredsStateSlice;
  Goals: GoalsStateSlice;
  Learnings: LearningsStateSlice;
  Resources: ResourcesStateSlice;
  Plans: PlansStateSlice;
}

export type AppStoreSlice<T> = StateCreator<
  AppStoreState,
  [['zustand/immer', never]],
  [],
  T
>;
