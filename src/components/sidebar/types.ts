export type SidebarComponentProps = {
  sideBarOpen: boolean;
};

export type SidebarIconProps = {
  icon: SidebarIconType;
};

export enum SidebarIconType {
  Home = 'home',
  Projects = 'projects',
  Plans = 'plans',
  Expenses = 'expenses',
  Goals = 'goals',
  Credentials = 'credentials',
  Profile = 'profile',
  Learning = 'learning',
  Resources = 'resources',
}
