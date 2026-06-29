import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../testUtils/renderUtils';
import PrivacyPolicy from '../PrivacyPolicy';

jest.mock('@assets', () => ({
  GrowboardIcon: () => <svg data-testid="growboard-icon" />,
}));

describe('PrivacyPolicy screen', () => {
  it('renders privacy policy sections correctly', () => {
    renderWithProviders(<PrivacyPolicy />);

    expect(screen.getByRole('heading', { name: /Privacy Policy/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Introduction/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /No Data Collection/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /No Backend Servers/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Google OAuth/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Google Drive Access/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Third-Party Services/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Changes to This Policy/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Contact/i })).toBeInTheDocument();

    // Check sample body content text
    expect(
      screen.getByText(/GrowBoard does not collect any personal information/i)
    ).toBeInTheDocument();
  });
});
