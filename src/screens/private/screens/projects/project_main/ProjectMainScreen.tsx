import { ProjectCard, getProjectCardData } from '@components';
import { projectsSelector, useShallow } from '@selectors';
import { appStore } from '@store';

const ProjectMainScreen = () => {
  const { projectData } = appStore(useShallow(projectsSelector));

  return (
    <div className="m-2">
      <div className=" gap-2 flex flex-wrap justify-around">
        {projectData.map((project, index) => (
          <div key={index}>
            <ProjectCard data={getProjectCardData(project)} />
          </div>
        ))}
      </div>
    </div>
  );
};

// Export the ProjectMainScreen component.
export default ProjectMainScreen;
