import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../testUtils/renderUtils';
import { DialogContainer } from '../DialogContainer';
import { Button } from '@chakra-ui/react';

describe('DialogContainer component', () => {
  const mockOnOpenChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render content when isOpen is false', () => {
    renderWithProviders(
      <DialogContainer
        isOpen={false}
        onOpenChange={mockOnOpenChange}
        title="Test Title"
      >
        <div>Test Body Content</div>
      </DialogContainer>,
    );

    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
    expect(screen.queryByText('Test Body Content')).not.toBeInTheDocument();
  });

  it('renders title, body children, and footer when isOpen is true', async () => {
    renderWithProviders(
      <DialogContainer
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        title="Active Dialog Header"
        footer={<Button>Submit Action</Button>}
      >
        <div>Body Content Inside Container</div>
      </DialogContainer>,
    );

    // Verify title and body are visible in DOM
    expect(await screen.findByText('Active Dialog Header')).toBeInTheDocument();
    expect(
      screen.getByText('Body Content Inside Container'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Submit Action/i }),
    ).toBeInTheDocument();
  });
});
