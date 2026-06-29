import { create } from 'zustand';

import { immer } from 'zustand/middleware/immer';

import {
  createAlertSlice,
  createAuthSlice,
  createProjectsSlice,
  createImageModalSlice,
  createExpenseSlice,
  createCredsSlice,
  createGoalsSlice,
  createLearningsSlice,
  createResourcesSlice,
  createPlansSlice,
} from '@store/slice';
import { createJSONStorage, persist } from 'zustand/middleware';

import { AppStoreState } from './types';
import { createProfileSlice } from '../slice/User';

export const appStore = create<AppStoreState>()(
  persist(
    immer((...api) => ({
      Alert: createAlertSlice(...api),
      Auth: createAuthSlice(...api),
      Expense: createExpenseSlice(...api),
      Projects: createProjectsSlice(...api),
      ImageModal: createImageModalSlice(...api),
      Profile: createProfileSlice(...api),
      Creds: createCredsSlice(...api),
      Goals: createGoalsSlice(...api),
      Learnings: createLearningsSlice(...api),
      Resources: createResourcesSlice(...api),
      Plans: createPlansSlice(...api),
    })),

    {
      name: 'appStore',
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState, currentState) =>
        deepMerge(currentState, persistedState as AppStoreState),
    },
  ),
);

/**
 * Function to merge the persisted state with the current state.
 *
 * @param currentState current state
 * @param persistedState persisted state
 * @returns merged state
 */
function deepMerge(
  currentState: AppStoreState,
  persistedState: AppStoreState,
): AppStoreState {
  return {
    ...currentState,
    Auth: {
      ...currentState.Auth,
      ...persistedState.Auth,
    },
    Creds: {
      ...currentState.Creds,
      ...persistedState.Creds,
    },
    Goals: {
      ...currentState.Goals,
      ...persistedState.Goals,
    },
    Learnings: {
      ...currentState.Learnings,
      ...persistedState.Learnings,
    },
    Resources: {
      ...currentState.Resources,
      ...persistedState.Resources,
    },
    Plans: {
      ...currentState.Plans,
      ...persistedState.Plans,
    },
    Projects: {
      ...currentState.Projects,
      ...persistedState.Projects,
    },
  };
}
