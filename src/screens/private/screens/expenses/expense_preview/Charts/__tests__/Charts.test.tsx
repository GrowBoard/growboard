import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../../../../../testUtils/renderUtils';
import Charts from '../Charts';

jest.mock('@components', () => {
  const actual = jest.requireActual('@components');
  return {
    ...actual,
    PieChart: () => <div data-testid="mock-pie-chart">Pie Chart</div>,
    LineChart: () => <div data-testid="mock-line-chart">Line Chart</div>,
  };
});

jest.mock('@hooks', () => ({
  useGetExpensesDataForDate: jest.fn(() => ({
    data: { data: [] },
    isLoading: false,
  })),
}));

jest.mock('@store', () => ({
  appStore: jest.fn((selector) => {
    return {
      dateState: { year: 2026, month: 5, day: 26 },
    };
  }),
  TimeWindow: {
    DAY: 'DAY',
    WEEK: 'WEEK',
    MONTH: 'MONTH',
  },
}));

describe('Charts component', () => {
  it('should render charts when loaded', () => {
    renderWithProviders(<Charts />);
    expect(screen.getByTestId('mock-pie-chart')).toBeDefined();
    expect(screen.getByTestId('mock-line-chart')).toBeDefined();
  });
});
