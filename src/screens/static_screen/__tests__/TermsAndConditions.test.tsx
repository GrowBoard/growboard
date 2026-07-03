import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../testUtils/renderUtils';
import TermsAndConditions from '../TermsAndConditions';

jest.mock('@assets', () => ({
  GrowboardIcon: () => <svg data-testid="growboard-icon" />,
}));

describe('TermsAndConditions screen', () => {
  it('renders terms and conditions sections correctly', () => {
    renderWithProviders(<TermsAndConditions />);

    expect(
      screen.getByRole('heading', { name: /Terms & Conditions/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Acceptance of Terms/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Description of Service/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Google Account/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /User Responsibilities/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /No Warranty/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Limitation of Liability/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Data Responsibility/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Modifications/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Governing Law/i }),
    ).toBeInTheDocument();

    // Check responsibilities list items
    expect(
      screen.getByText(/Use GrowBoard in compliance with all applicable laws/i),
    ).toBeInTheDocument();
  });
});
