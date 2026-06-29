import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../testUtils/renderUtils';
import DataPolicy from '../DataPolicy';

jest.mock('@assets', () => ({
  GrowboardIcon: () => <svg data-testid="growboard-icon" />,
}));

describe('DataPolicy screen', () => {
  it('renders data policy sections correctly', () => {
    renderWithProviders(<DataPolicy />);

    expect(screen.getByRole('heading', { name: /Data Policy/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Overview/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Data Storage/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Data Flow/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Data Ownership/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Data Encryption/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Data Retention/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /No Data Sharing/i })).toBeInTheDocument();

    // Check list item text
    expect(screen.getByText('Browser Local Storage:', { selector: 'strong' })).toBeInTheDocument();
    expect(screen.getByText('Google Drive:', { selector: 'strong' })).toBeInTheDocument();
  });
});
