import { renderHook } from '@testing-library/react';
import useColorSelector from './useColorSelector';

describe('useColorSelector', () => {
  it('should return correct semantic token references', () => {
    const { result } = renderHook(() => useColorSelector());

    expect(result.current).toEqual({
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
    });
  });
});
