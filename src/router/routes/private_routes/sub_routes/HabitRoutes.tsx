import React from 'react';
import { LazyHabitsScreenComponent } from '@provider';
import { Route } from 'react-router-dom';

/**
 * Route definition for the Habit Tracker screen.
 */
const HabitRoutes = (
  <Route path="habits" element={<LazyHabitsScreenComponent />} />
) as React.ReactNode;

export { HabitRoutes };
