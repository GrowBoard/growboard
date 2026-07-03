import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

import { renderWithProviders } from '../../../testUtils/renderUtils';
import NavigationComponent from '../Navigation';
import { appStore } from '@store';

jest.mock('@provider', () => ({
  ThemeProvider: ({ children }: any) => (
    <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
  ),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: any) => {
      if (key === 'ProfileMenuOption.hiText') return `Hi, ${opts?.name}`;
      if (key === 'ProfileMenuOption.profile') return 'Profile';
      if (key === 'ProfileMenuOption.settings') return 'Settings';
      if (key === 'ProfileMenuOption.logout') return 'Logout';
      return key;
    },
  }),
}));

jest.mock('@assets', () => ({
  GrowboardIcon: () => <svg data-testid="growboard-icon" />,
}));

jest.mock('@components/Theme/colorMode', () => ({
  useColorMode: jest.fn().mockReturnValue({
    colorMode: 'light',
    toggleColorMode: jest.fn(),
  }),
}));

describe('NavigationComponent', () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    appStore.setState({
      Auth: {
        ...appStore.getState().Auth,
        name: 'Amit',
        picture: '',
      },
    });
  });

  it('renders logo and GrowBoard text', () => {
    renderWithProviders(<NavigationComponent logOutClickHandler={mockLogout} />);
    expect(screen.getByTestId('growboard-icon')).toBeInTheDocument();
    expect(screen.getByText('GrowBoard')).toBeInTheDocument();
  });

  it('renders profile picture when picture URL is available', () => {
    appStore.setState({
      Auth: {
        ...appStore.getState().Auth,
        name: 'Amit',
        picture: 'http://example.com/photo.jpg',
      },
    });

    renderWithProviders(<NavigationComponent logOutClickHandler={mockLogout} />);
    const img = screen.getByRole('img', { name: /Amit|Profile Picture/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'http://example.com/photo.jpg');
  });

  it('renders icon fallback when no picture URL', () => {
    appStore.setState({
      Auth: {
        ...appStore.getState().Auth,
        name: 'Amit',
        picture: null,
      },
    });

    renderWithProviders(<NavigationComponent logOutClickHandler={mockLogout} />);
    // Icon fallback should be present (no img element)
    expect(screen.queryByRole('img', { name: /Profile Picture/i })).not.toBeInTheDocument();
  });
});
