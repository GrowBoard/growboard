/* eslint-disable jsx-a11y/iframe-has-title */

import { ImagePreviewModalButton } from '@components';
import { WebsiteIcon, GithubIcon, HostingerIcon } from '@assets';
import { imageModalSelector, useShallow } from '@selectors';
import { appStore } from '@store';
import { Key } from 'react';

export type IProjectPreviewComponentProps = {
  project: any;
};

const ProjectPreviewComponent = (props: IProjectPreviewComponentProps) => {
  const { setImageString } = appStore(useShallow(imageModalSelector));
  const onImageClickHandler = (image: string) => {
    setImageString(image);
  };

  return (
    <div className="bg-base-100 shadow-xl outline-double rounded-md w-full px-4  py-1 h-full">
      <div className="w-full grid grid-cols-2">
        <div className="flex flex-col justify-start gap-3">
          <div className="flex flex-row items-start justify-between">
            <div className="flex flex-row items-start justify-center">
              <img
                src={props.project.projectIcon}
                alt={props.project.title}
                loading="lazy"
                className="w-[100px] h-[100px] rounded-md outline p-1 mt-4 hover:scale-110 transition-all duration-300 ease-in-out"
              />
              <div className="p-4">
                <h1 className="text-4xl font-bold textarea-ghost">
                  {props.project.projectName}
                </h1>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center p-5">
              {props.project.isLive ? (
                <span className="badge badge-success animate-pulse duration-75 m-1">
                  Live
                </span>
              ) : (
                <span className="badge badge-error m-1">Not live</span>
              )}
            </div>
          </div>
          {/* Link buttons */}
          <div className="flex flex-row justify-between p-2">
            <a
              href={'http://' + props.project.projectLink}
              target="_blank"
              rel="noreferrer"
              className="btn btn-success justify-between btn-outline w-[190px]"
            >
              <WebsiteIcon />
              Project live link
            </a>
            <a
              href={props.project.githubLink}
              target="_blank"
              rel="noreferrer"
              className="btn justify-between px-3 btn-outline w-[190px]"
            >
              <GithubIcon />
              Github repo link
            </a>
            <a
              href={props.project.hostingerLink}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline btn-info justify-between px-4 w-[190px]"
            >
              <HostingerIcon />
              Hostinger link
            </a>
          </div>
          {/* Project description */}
          <div className="flex flex-col items-start">
            <h2 className="text-xl font-semibold">Project description</h2>
            <p className="text-base">{props.project.projectDesc}</p>
          </div>
          <div className="flex flex-row items-start overflow-scroll gap-3 p-2 ">
            {props.project.images.map(
              (image: string | undefined, index: Key | null | undefined) => (
                <ImagePreviewModalButton
                  onClickHandler={() => {
                    onImageClickHandler(image as string);
                  }}
                  key={index}
                >
                  <img
                    key={index}
                    src={image}
                    alt={props.project.title}
                    loading="lazy"
                    className="w-[150px] h-[100px] rounded-md outline p-1 mt-4 hover:scale-105 hover:cursor-pointer"
                  />
                </ImagePreviewModalButton>
              ),
            )}
          </div>
        </div>
        {/** Mockup part */}
        <div className="flex flex-col items-center justify-center">
          <div className="mockup-browser border border-base-300 w-[100%]">
            <div className="mockup-browser-toolbar">
              <div className="input border border-base-300">
                {props.project.projectLink}
              </div>
            </div>
            <div className="flex justify-center bg-base-200">
              <iframe
                width={1500}
                height={400}
                style={{ border: 0 }}
                loading="lazy"
                className=""
                src={'http://' + props.project.projectLink}
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPreviewComponent;
