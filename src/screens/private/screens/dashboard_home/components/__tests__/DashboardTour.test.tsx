import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../../testUtils/renderUtils';
import { DashboardTour } from '../DashboardTour';

// Mock react-joyride to avoid portal rendering issues in JSDOM
jest.mock('react-joyride', () => {
  const mockJoyride = jest.fn(({ run, steps, onEvent }) => {
    if (!run) return null;
    return (
      <div data-testid="mock-joyride">
        {steps.map((step: any, idx: number) => (
          <div key={idx} data-testid={`step-${idx}`} data-target={step.target}>
            <h3>{step.title}</h3>
            <p>{step.content}</p>
          </div>
        ))}
        <button
          data-testid="mock-finish-btn"
          onClick={() => onEvent({ status: 'finished' })}
        >
          Finish
        </button>
        <button
          data-testid="mock-skip-btn"
          onClick={() => onEvent({ status: 'skipped' })}
        >
          Skip
        </button>
      </div>
    );
  });

  return {
    __esModule: true,
    Joyride: mockJoyride,
    STATUS: {
      FINISHED: 'finished',
      SKIPPED: 'skipped',
    },
  };
});

describe('DashboardTour Component', () => {
  const mockOnTourEnd = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when run is false', () => {
    renderWithProviders(<DashboardTour run={false} onTourEnd={mockOnTourEnd} />);
    expect(screen.queryByTestId('mock-joyride')).not.toBeInTheDocument();
  });

  it('renders mock joyride steps when run is true', () => {
    renderWithProviders(<DashboardTour run={true} onTourEnd={mockOnTourEnd} />);
    expect(screen.getByTestId('mock-joyride')).toBeInTheDocument();

    // Verify all steps targets exist in the mock steps render using actual translated text
    expect(screen.getByText('Welcome to GrowBoard!')).toBeInTheDocument();
    expect(screen.getByText('Home Console')).toBeInTheDocument();
    expect(screen.getByText('Projects Tracker')).toBeInTheDocument();
    expect(screen.getByText('Deadline Plans')).toBeInTheDocument();
    expect(screen.getByText('Expense Register')).toBeInTheDocument();
    expect(screen.getByText('Milestone Goals')).toBeInTheDocument();
    expect(screen.getByText('Knowledge Base')).toBeInTheDocument();
    expect(screen.getByText('Web Resources')).toBeInTheDocument();
    expect(screen.getByText('Credentials Locker')).toBeInTheDocument();
    expect(screen.getByText('User Profile')).toBeInTheDocument();
    expect(screen.getByText('Productivity Metrics')).toBeInTheDocument();
    expect(screen.getByText('Recent Activity & Summary')).toBeInTheDocument();
    expect(screen.getByText('Quick Action Shortcuts')).toBeInTheDocument();
  });

  it('calls onTourEnd when finishing the tour', () => {
    renderWithProviders(<DashboardTour run={true} onTourEnd={mockOnTourEnd} />);
    const finishBtn = screen.getByTestId('mock-finish-btn');
    fireEvent.click(finishBtn);
    expect(mockOnTourEnd).toHaveBeenCalledTimes(1);
  });

  it('calls onTourEnd when skipping the tour', () => {
    renderWithProviders(<DashboardTour run={true} onTourEnd={mockOnTourEnd} />);
    const skipBtn = screen.getByTestId('mock-skip-btn');
    fireEvent.click(skipBtn);
    expect(mockOnTourEnd).toHaveBeenCalledTimes(1);
  });
});
