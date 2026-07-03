import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../../testUtils/renderUtils';
import ProfilePreviewScreen from '../ProfilePreviewScreen';
import { appStore } from '@store';

// Mock clipboard API
const mockWriteText = jest.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

// Mock useGetProfileData
jest.mock('@services/hooks/private', () => ({
  useGetProfileData: jest.fn(() => ({
    isLoading: false,
    data: null,
  })),
}));

describe('ProfilePreviewScreen component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Google Auth info when profile data is empty', () => {
    appStore.setState({
      Auth: {
        token: 'token',
        name: 'Alice Google',
        email: 'alice@google.com',
        picture: 'https://avatar.png',
        expires_at: 0,
      },
      Profile: {
        userData: {
          bio: '',
          phone_number: [],
          hobbies: [],
          socialLink: {
            facebook: '',
            instagram: '',
            github: '',
            x: '',
            website: '',
            linkedin: '',
          },
        },
      },
    });

    renderWithProviders(<ProfilePreviewScreen />);
    expect(screen.getByText('Alice Google')).toBeInTheDocument();
    expect(screen.getByText('alice@google.com')).toBeInTheDocument();
  });

  it('renders profile details: bio, phone, hobbies, and social links', () => {
    appStore.setState({
      Auth: {
        token: 'token',
        name: 'Bob',
        email: 'bob@example.com',
        picture: '',
        expires_at: 0,
      },
      Profile: {
        userData: {
          bio: 'Software Dev',
          phone_number: ['1234567890'],
          hobbies: ['Coding', 'Gaming'],
          socialLink: {
            facebook: 'fb.com/bob',
            instagram: 'inst.com/bob',
            github: 'github.com/bob',
            x: 'x.com/bob',
            website: 'bob.dev',
            linkedin: 'linkedin.com/in/bob',
          },
        },
      },
    });

    renderWithProviders(<ProfilePreviewScreen />);
    expect(screen.getByText(/Software Dev/)).toBeInTheDocument();
    expect(screen.getByText('1234567890')).toBeInTheDocument();
    expect(screen.getByText('Coding')).toBeInTheDocument();
    expect(screen.getByText('Gaming')).toBeInTheDocument();

    // Verify social links exist and point to the correct places
    const githubLink = screen.getByTitle('Github');
    expect(githubLink).toHaveAttribute('href', 'https://github.com/bob');

    const linkedinLink = screen.getByTitle('LinkedIn');
    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/bob');
  });

  it('copies phone number to clipboard when copy button is clicked', async () => {
    appStore.setState({
      Auth: {
        token: 'token',
        name: 'Bob',
        email: 'bob@example.com',
        picture: '',
        expires_at: 0,
      },
      Profile: {
        userData: {
          bio: '',
          phone_number: ['9876543210'],
          hobbies: [],
          socialLink: {
            facebook: '',
            instagram: '',
            github: '',
            x: '',
            website: '',
            linkedin: '',
          },
        },
      },
    });

    renderWithProviders(<ProfilePreviewScreen />);
    const copyBtn = screen.getByRole('button', { name: /Copy phone number/i });
    fireEvent.click(copyBtn);

    expect(mockWriteText).toHaveBeenCalledWith('9876543210');
  });
});
