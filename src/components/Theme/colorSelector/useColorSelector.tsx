const useColorSelector = () => {
  return {
    text: {
      Heading: 'text.heading',
      Hero: 'text.hero',
    },
    icon: {
      primary: {
        color: 'icon.primaryColor',
        bg: 'icon.primaryBg',
      },
      secondary: 'icon.secondary',
    },
    bg: {
      container: 'bg.container',
    },
    gradient: {
      topAppBar: 'gradient.topAppBar',
      sideBarBG: 'gradient.sideBarBG',
      contentBG: 'gradient.contentBG',
    },
  };
};

export default useColorSelector;
