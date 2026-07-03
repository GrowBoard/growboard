import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../testUtils/renderUtils';
import SidebarComponent from '../SidebarComponent';
import { appStore } from '@store';

describe('SidebarComponent component', () => {
  beforeEach(() => {
    // Reset store state
    appStore.setState({
      Auth: {
        ...appStore.getState().Auth,
        token: '',
        name: '',
        email: '',
        picture: '',
      },
    });
  });

  it('renders all route links with their icons', () => {
    renderWithProviders(<SidebarComponent />);

    // Check that we render navigation links with correct href values
    expect(document.querySelector('a[href="/dashboard"]')).toBeInTheDocument();
    expect(document.querySelector('a[href="/projects"]')).toBeInTheDocument();
    expect(document.querySelector('a[href="/plans"]')).toBeInTheDocument();
    expect(document.querySelector('a[href="/expenses"]')).toBeInTheDocument();
    expect(document.querySelector('a[href="/goals"]')).toBeInTheDocument();
    expect(document.querySelector('a[href="/learning"]')).toBeInTheDocument();
    expect(document.querySelector('a[href="/resources"]')).toBeInTheDocument();
    expect(document.querySelector('a[href="/creds"]')).toBeInTheDocument();

    // Check that profile link is rendered (default fallback icon since picture is empty)
    expect(document.querySelector('a[href="/profile"]')).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: /Profile Picture/i })).not.toBeInTheDocument();
  });

  it('renders profile picture if provided in store', () => {
    appStore.setState({
      Auth: {
        ...appStore.getState().Auth,
        token: 'token',
        name: 'Bob',
        picture: 'https://example.com/bob.png',
      },
    });

    renderWithProviders(<SidebarComponent />);

    const avatarImg = screen.getByAltText('Bob');
    expect(avatarImg).toBeInTheDocument();
    expect(avatarImg).toHaveAttribute('src', 'https://example.com/bob.png');
  });
});
