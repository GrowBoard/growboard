/**
 * Routes for the sidebar.
 */
const SidebarRoutes = [
  {
    nameKey: 'Sidebar.home',
    path: '/dashboard',
    iconName: 'home',
  },
  {
    nameKey: 'Sidebar.projects',
    path: '/projects',
    iconName: 'projects',
  },
  {
    nameKey: 'Sidebar.plans',
    path: '/plans',
    iconName: 'plans',
  },
  {
    nameKey: 'Sidebar.expenses',
    path: '/expenses',
    iconName: 'expenses',
  },
  {
    nameKey: 'Sidebar.goals',
    path: '/goals',
    iconName: 'goals',
  },
  {
    nameKey: 'Sidebar.learning',
    path: '/learning',
    iconName: 'learning',
  },
  {
    nameKey: 'Sidebar.resources',
    path: '/resources',
    iconName: 'resources',
  },
  {
    nameKey: 'Sidebar.habits',
    path: '/habits',
    iconName: 'habits',
  },
  {
    nameKey: 'Sidebar.creds',
    path: '/creds',
    iconName: 'credentials',
  },
];

const ProfileRoutes = {
  nameKey: 'Sidebar.profile',
  path: '/profile',
  iconName: 'profile',
};

export default SidebarRoutes;
export { ProfileRoutes };
