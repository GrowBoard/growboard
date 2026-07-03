import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../testUtils/renderUtils';
import PieChart from '../PieChart';

// Mock react-chartjs-2 to avoid rendering Canvas in JSDOM
jest.mock('react-chartjs-2', () => ({
  Doughnut: () => <div data-testid="mock-doughnut" />,
}));

describe('PieChart component', () => {
  const data = {
    labels: ['Food', 'Travel'],
    datasets: [
      {
        data: [1500, 500],
        backgroundColor: ['#ff0000', '#00ff00'],
      },
    ],
  };

  const defaultProps = {
    data,
    width: '300px',
    height: '300px',
    totalTransactions: 5,
    highestCategory: { name: 'Food', amount: 1500, color: '#ff0000' },
    dailyAverage: 66.6,
  };

  it('renders title and doughnut chart', () => {
    renderWithProviders(<PieChart {...defaultProps} />);
    expect(screen.getByText('Expense Distribution')).toBeInTheDocument();
    expect(screen.getByTestId('mock-doughnut')).toBeInTheDocument();
  });

  it('renders total sum in the center of the doughnut chart', () => {
    renderWithProviders(<PieChart {...defaultProps} />);
    // Total sum is 1500 + 500 = 2000
    expect(screen.getByText('₹2,000')).toBeInTheDocument();
  });

  it('renders category legend with percentages', () => {
    renderWithProviders(<PieChart {...defaultProps} />);
    expect(screen.getByText('Food')).toBeInTheDocument();
    expect(screen.getByText('(75%)')).toBeInTheDocument();
    expect(screen.getByText('₹1,500')).toBeInTheDocument();

    expect(screen.getByText('Travel')).toBeInTheDocument();
    expect(screen.getByText('(25%)')).toBeInTheDocument();
    expect(screen.getByText('₹500')).toBeInTheDocument();
  });

  it('renders quick insights: daily average and peak category', () => {
    renderWithProviders(<PieChart {...defaultProps} />);
    expect(screen.getByText('₹67')).toBeInTheDocument(); // Math.round(66.6)
    expect(screen.getByText('Food (₹1,500)')).toBeInTheDocument();
    expect(screen.getByText('5 transactions')).toBeInTheDocument();
  });

  it('renders empty state message when no data is present', () => {
    const emptyData = {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [],
        },
      ],
    };
    renderWithProviders(<PieChart {...defaultProps} data={emptyData} />);
    expect(screen.getByText('No expenses recorded')).toBeInTheDocument();
  });
});
