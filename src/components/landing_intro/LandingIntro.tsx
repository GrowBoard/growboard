import TemplatePointers from './TemplatePointer';

/**
 * LandingIntro component
 *
 * @returns The LandingIntro component.
 */
const LandingIntro = () => {
  return (
    <div className="hero min-h-full">
      <div className="hero-content py-12">
        <div className="max-w-md">
          <img
            src={require('../../assets/images/logo-no-bg.png')}
            className="inline-block mr-2 mask"
            alt="dashwind-logo"
          />
          {/*  pointers component */}
          <div className=" text-secondary-content">
            <TemplatePointers />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingIntro;
