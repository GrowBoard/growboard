import { create } from 'zustand';

import { immer } from 'zustand/middleware/immer';

import {
  createAlertSlice,
  createAuthSlice,
  createProjectsSlice,
  createImageModalSlice,
  createExpenseSlice,
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
  };
}
