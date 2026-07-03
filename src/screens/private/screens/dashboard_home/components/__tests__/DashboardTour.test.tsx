import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { STATUS } from 'react-joyride';

import { renderWithProviders } from '../../../../../../testUtils/renderUtils';
import { DashboardTour } from '../DashboardTour';

// Mock @provider to break circular dependency during test import phase
jest.mock('@provider', () => ({
  ThemeProvider: ({ children }: any) => (
    <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
  ),
}));

// Mock react-joyride
const mockJoyrideRender = jest.fn();
jest.mock('react-joyride', () => {
  return {
    Joyride: (props: any) => {
      mockJoyrideRender(props);
      return <div data-testid="mock-joyride" />;
    },
    STATUS: {
      FINISHED: 'finished',
      SKIPPED: 'skipped',
    },
  };
});

describe('DashboardTour component', () => {
  const mockOnTourEnd = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Joyride component with correct options', () => {
    renderWithProviders(<DashboardTour run={true} onTourEnd={mockOnTourEnd} />);

    expect(screen.getByTestId('mock-joyride')).toBeInTheDocument();
    expect(mockJoyrideRender).toHaveBeenCalledWith(
      expect.objectContaining({
        run: true,
        continuous: true,
      })
    );
  });

  it('triggers onTourEnd on finished or skipped status event', () => {
    renderWithProviders(<DashboardTour run={true} onTourEnd={mockOnTourEnd} />);

    const joyrideCallProps = mockJoyrideRender.mock.calls[0][0];

    // Trigger normal progression event (should NOT trigger onTourEnd)
    joyrideCallProps.onEvent({ status: 'running' });
    expect(mockOnTourEnd).not.toHaveBeenCalled();

    // Trigger finished event
    joyrideCallProps.onEvent({ status: STATUS.FINISHED });
    expect(mockOnTourEnd).toHaveBeenCalledTimes(1);

    // Trigger skipped event
    joyrideCallProps.onEvent({ status: STATUS.SKIPPED });
    expect(mockOnTourEnd).toHaveBeenCalledTimes(2);
  });

  it('renders custom tooltip component correctly', () => {
    renderWithProviders(<DashboardTour run={true} onTourEnd={mockOnTourEnd} />);

    const joyrideCallProps = mockJoyrideRender.mock.calls[0][0];
    const CustomTooltip = joyrideCallProps.tooltipComponent;

    const tooltipProps = {
      continuous: true,
      index: 0,
      step: {
        title: 'Step 1 Title',
        content: 'Step 1 Content',
        target: '.test-target',
      },
      backProps: { onClick: jest.fn() },
      primaryProps: { onClick: jest.fn(), 'aria-label': 'Next' },
      tooltipProps: { 'data-testid': 'tooltip-wrapper' },
      skipProps: { onClick: jest.fn() },
      size: 3,
      isLastStep: false,
    } as any;

    // Render tooltip directly
    renderWithProviders(<CustomTooltip {...tooltipProps} />);

    expect(screen.getByText('Step 1 Title')).toBeInTheDocument();
    expect(screen.getByText('Step 1 Content')).toBeInTheDocument();
    expect(screen.getByText('Skip Tour')).toBeInTheDocument();

    // Re-render as index > 0 to show Back button
    const tooltipPropsMiddleStep = {
      ...tooltipProps,
      index: 1,
    };
    renderWithProviders(<CustomTooltip {...tooltipPropsMiddleStep} />);
    expect(screen.getByText('Back')).toBeInTheDocument();
  });
});
