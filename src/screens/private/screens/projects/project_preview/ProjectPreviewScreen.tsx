import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProjectPreviewComponent from './ProjectPreviewComponent';
import { projectsSelector, useShallow } from '@selectors';
import { appStore } from '@store';

type ProjectSelectData = {
  projectId: string;
  projectName: string;
};

const ProjectPreviewScreen = () => {
  const { projectData } = appStore(useShallow(projectsSelector));
  const projectIdData: ProjectSelectData[] = projectData.map((project) => {
    return {
      projectId: project.projectId,
      projectName: project.projectName,
    };
  });

  const initialProjectId = projectData[0].projectId;
  const [selectedProjectId, setSelectedProjectId] =
    useState<string>(initialProjectId);

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setSelectedProjectId(id);
    } else {
      setSelectedProjectId(initialProjectId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlerProjectChange = (event: any) => {
    setSelectedProjectId(event.target.value);
  };

  return (
    <div className="w-[98%]">
      <div className=" w-full flex justify-between mx-2 my-1">
        <div className="text-lg font-bold">
          {/* Project live state badge */}
        </div>
        <select
          className="select select-bordered w-full max-w-xs"
          onChange={handlerProjectChange}
        >
          <option disabled>Select project</option>
          {projectIdData.map((project, index) => (
            <option
              key={index}
              value={project.projectId}
              selected={project.projectId === id}
            >
              {project.projectName}
            </option>
          ))}
        </select>
      </div>
      <div className="m-2">
        <div className=" gap-2 flex flex-wrap justify-center">
          <ProjectPreviewComponent
            project={
              projectData.find(
                (project) => project.projectId === selectedProjectId,
              )!
            }
          />
        </div>
      </div>
    </div>
  );
};

// Export the ProjectPreviewScreen component.
export default ProjectPreviewScreen;
