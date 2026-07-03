import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../../../testUtils/renderUtils';
import { ProfileForm } from '../ProfileForm';

describe('ProfileForm component', () => {
  const initialData = {
    bio: 'Software engineer from NY',
    phone_number: ['1234567890'],
    socialLink: {
      facebook: 'fb.com/user',
      instagram: 'ig.com/user',
      github: 'github.com/user',
      x: 'x.com/user',
      website: 'user.dev',
    },
    hobbies: ['Reading', 'Gaming'],
  };

  const defaultProps = {
    initialData,
    name: 'Alice Cooper',
    saveMutation: {
      mutateAsync: jest.fn(() => Promise.resolve()),
      isPending: false,
    } as any,
    successToast: jest.fn(),
    errorToast: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders initial form values correctly', () => {
    renderWithProviders(<ProfileForm {...defaultProps} />);

    // Name (disabled InputText)
    expect(screen.getByDisplayValue('Alice Cooper')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Alice Cooper')).toBeDisabled();

    // Bio
    expect(
      screen.getByDisplayValue('Software engineer from NY'),
    ).toBeInTheDocument();

    // Phone Numbers
    expect(screen.getByDisplayValue('1234567890')).toBeInTheDocument();

    // Hobbies badges
    expect(screen.getByText('Reading')).toBeInTheDocument();
    expect(screen.getByText('Gaming')).toBeInTheDocument();

    // Social fields
    expect(screen.getByDisplayValue('fb.com/user')).toBeInTheDocument();
    expect(screen.getByDisplayValue('ig.com/user')).toBeInTheDocument();
    expect(screen.getByDisplayValue('github.com/user')).toBeInTheDocument();
    expect(screen.getByDisplayValue('x.com/user')).toBeInTheDocument();
    expect(screen.getByDisplayValue('user.dev')).toBeInTheDocument();

    // Save button (should be disabled because form is clean/not dirty)
    expect(
      screen.getByRole('button', { name: /Save Settings/i }),
    ).toBeDisabled();
  });

  it('adds and removes phone numbers', () => {
    renderWithProviders(<ProfileForm {...defaultProps} />);

    // An extra empty input is always appended at the end of the phone number list
    const phoneInputs = screen.getAllByPlaceholderText('Enter phone number');
    expect(phoneInputs).toHaveLength(2); // One filled, one empty
    expect(phoneInputs[0].value).toBe('1234567890');
    expect(phoneInputs[1].value).toBe('');

    // Update the second input
    fireEvent.change(phoneInputs[1], { target: { value: '0987654321' } });
    expect(phoneInputs[1].value).toBe('0987654321');

    // Remove first phone number
    const removeBtns = screen.getAllByRole('button', {
      name: /Remove phone number/i,
    });
    expect(removeBtns).toHaveLength(2); // Remove button exists for non-empty items
    fireEvent.click(removeBtns[0]);

    // First one is removed
    const updatedInputs = screen.getAllByPlaceholderText('Enter phone number');
    expect(updatedInputs[0].value).toBe('0987654321');
  });

  it('adds and removes hobbies', () => {
    renderWithProviders(<ProfileForm {...defaultProps} />);

    const hobbyInput = screen.getByPlaceholderText(
      'Type a hobby and press Enter to add',
    );

    // Add new hobby
    fireEvent.change(hobbyInput, { target: { value: 'Coding' } });
    fireEvent.keyDown(hobbyInput, {
      key: 'Enter',
      code: 'Enter',
      charCode: 13,
    });

    expect(screen.getByText('Coding')).toBeInTheDocument();

    // Remove a hobby
    const removeHobbyBtns = screen.getAllByRole('button', {
      name: /Remove hobby/i,
    });
    expect(removeHobbyBtns).toHaveLength(3); // Reading, Gaming, Coding
    fireEvent.click(removeHobbyBtns[0]); // Remove Reading

    expect(screen.queryByText('Reading')).not.toBeInTheDocument();
  });

  it('handles submission success', async () => {
    renderWithProviders(<ProfileForm {...defaultProps} />);

    // Make the form dirty by updating bio
    const bioInput = screen.getByPlaceholderText('Tell us about yourself...');
    fireEvent.change(bioInput, {
      target: { value: 'A modified bio description' },
    });

    // Enable Save Settings button
    const saveBtn = screen.getByRole('button', { name: /Save Settings/i });
    expect(saveBtn).not.toBeDisabled();

    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(defaultProps.saveMutation.mutateAsync).toHaveBeenCalledWith({
        bio: 'A modified bio description',
        phone_number: ['1234567890'],
        socialLink: {
          facebook: 'fb.com/user',
          instagram: 'ig.com/user',
          github: 'github.com/user',
          x: 'x.com/user',
          website: 'user.dev',
        },
        hobbies: ['Reading', 'Gaming'],
      });
      expect(defaultProps.successToast).toHaveBeenCalledWith(
        'Profile updated successfully on Google Drive! 🎉',
      );
    });
  });

  it('handles submission failure', async () => {
    const errorMutation = {
      mutateAsync: jest.fn(() =>
        Promise.reject(new Error('Drive quota exceeded')),
      ),
      isPending: false,
    };
    renderWithProviders(
      <ProfileForm {...defaultProps} saveMutation={errorMutation as any} />,
    );

    // Make form dirty
    const bioInput = screen.getByPlaceholderText('Tell us about yourself...');
    fireEvent.change(bioInput, { target: { value: 'Something' } });

    const saveBtn = screen.getByRole('button', { name: /Save Settings/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(errorMutation.mutateAsync).toHaveBeenCalled();
      expect(defaultProps.errorToast).toHaveBeenCalledWith(
        'Failed to update profile: Drive quota exceeded',
      );
    });
  });
});
