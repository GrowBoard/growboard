import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../../testUtils/renderUtils';
import { GreetingHero } from '../GreetingHero';

describe('GreetingHero component', () => {
  it('renders the user name in the greeting', () => {
    renderWithProviders(<GreetingHero name="Alice" />);
    expect(screen.getByText(/Alice/i)).toBeInTheDocument();
  });

  it('renders "Good Morning" during morning hours', () => {
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(9);
    renderWithProviders(<GreetingHero name="Bob" />);
    expect(screen.getByText(/Good Morning, Bob/i)).toBeInTheDocument();
    jest.restoreAllMocks();
  });

  it('renders "Good Afternoon" during afternoon hours', () => {
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(14);
    renderWithProviders(<GreetingHero name="Carol" />);
    expect(screen.getByText(/Good Afternoon, Carol/i)).toBeInTheDocument();
    jest.restoreAllMocks();
  });

  it('renders "Good Evening" during evening hours', () => {
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(20);
    renderWithProviders(<GreetingHero name="Dave" />);
    expect(screen.getByText(/Good Evening, Dave/i)).toBeInTheDocument();
    jest.restoreAllMocks();
  });

  it('renders the formatted date string', () => {
    renderWithProviders(<GreetingHero name="Eve" />);
    // The date string will contain the current year
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });

  it('renders a motivational quote', () => {
    renderWithProviders(<GreetingHero name="Frank" />);
    // &ldquo;/&rdquo; render as Unicode curly quotes in the DOM
    const quoteEl = screen.getByText(/\u201c/i);
    expect(quoteEl).toBeInTheDocument();
  });
});
