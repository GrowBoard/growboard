import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../testUtils/renderUtils';
import LineChart from '../LineChart';
import { TimeWindow } from '@store';

// Mock react-chartjs-2 to avoid rendering Canvas in JSDOM
jest.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="mock-bar" />,
}));

describe('LineChart component', () => {
  const data = {
    labels: ['2026-07-01', '2026-07-02'],
    datasets: [
      {
        label: 'Spendings',
        data: [400, 600],
      },
    ],
  };

  const defaultProps = {
    data,
    width: '300px',
    height: '300px',
    timeWindow: TimeWindow.MONTH,
  };

  it('renders title, subnav-month and bar chart', () => {
    renderWithProviders(<LineChart {...defaultProps} />);
    expect(screen.getByText('Month expense stats')).toBeInTheDocument();
    expect(screen.getByTestId('mock-bar')).toBeInTheDocument();
  });
});
