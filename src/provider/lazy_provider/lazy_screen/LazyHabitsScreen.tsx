import { lazy } from 'react';
import LazyComponentProvider from '../component/LazyComponent';

const HabitTrackerScreen = lazy(
  () => import('@screens/private/screens/habit_tracker/HabitTrackerScreen'),
);

/**
 * LazyHabitsScreenComponent.
 * Lazy loaded component wrapper for the Habit Tracker screen.
 */
const LazyHabitsScreenComponent = () => {
  return (
    <LazyComponentProvider>
      <HabitTrackerScreen />
    </LazyComponentProvider>
  );
};

export { LazyHabitsScreenComponent };
export default LazyHabitsScreenComponent;
