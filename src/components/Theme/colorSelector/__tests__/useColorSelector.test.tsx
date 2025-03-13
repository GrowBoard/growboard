import { renderHook } from '@testing-library/react';
import useColorSelector from '../useColorSelector';
import { useColorMode } from '@chakra-ui/react';

jest.mock('@chakra-ui/react', () => ({
  useColorMode: jest.fn(() => ({ colorMode: 'light' })),
}));

const mockUseColorMode = useColorMode as jest.Mock;

describe('useColorSelector', () => {
  it('should return correct color for light mode', () => {
    const { result } = renderHook(() => useColorSelector());

    expect(result.current).toMatchSnapshot();
  });

  it('should return correct color for dark mode', () => {
    mockUseColorMode.mockImplementation(() => ({ colorMode: 'dark' }));
    const { result } = renderHook(() => useColorSelector());

    expect(result.current).toMatchSnapshot();
  });
});
