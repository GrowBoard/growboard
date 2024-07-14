/**
 * Project card data type definition.
 *
 * @param title The project title.
 * @param description The project description.
 * @param image The project image.
 * @param icon The project icon.
 * @param path The project path.
 * @param projectLiveLink The project live link.
 * @param githubLink The project github link.
 * @param isLive The project is live.
 * @param completed The project completed.
 */
export type ProjectCardData = {
  title: string;
  description: string;
  image: string;
  icon: string;
  path: string;
  projectLiveLink: string;
  githubLink: string;
  isLive: boolean;
  completed: number;
};

export type ProjectCardProps = {
  data: ProjectCardData;
};

export type TitleCardProps = {
  title: string;
  children: React.ReactNode;
  topMargin?: string;
  TopSideButtons?: React.ReactNode;
};
