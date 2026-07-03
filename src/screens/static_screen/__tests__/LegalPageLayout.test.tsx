import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../testUtils/renderUtils';
import LegalPageLayout from '../LegalPageLayout';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('@assets', () => ({
  GrowboardIcon: () => <svg data-testid="growboard-icon" />,
}));

describe('LegalPageLayout component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title, lastUpdated date, children, and brand header/footer', () => {
    renderWithProviders(
      <LegalPageLayout title="Test Policy" lastUpdated="30 June 2026">
        <div>Test Content</div>
      </LegalPageLayout>,
    );

    expect(screen.getByText('Test Policy')).toBeInTheDocument();
    expect(screen.getByText('Last Updated: 30 June 2026')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByText('GrowBoard')).toBeInTheDocument();
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();
    expect(screen.getByTestId('growboard-icon')).toBeInTheDocument();
  });

  it('navigates to home when clicking on the brand name', () => {
    renderWithProviders(
      <LegalPageLayout title="Test Policy" lastUpdated="30 June 2026">
        <div>Test Content</div>
      </LegalPageLayout>,
    );

    const brandLink = screen.getByText('GrowBoard');
    fireEvent.click(brandLink);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('navigates back when clicking the Back button', () => {
    renderWithProviders(
      <LegalPageLayout title="Test Policy" lastUpdated="30 June 2026">
        <div>Test Content</div>
      </LegalPageLayout>,
    );

    const backButton = screen.getByRole('button', { name: /Back/i });
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
