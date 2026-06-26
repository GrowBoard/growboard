import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../../../../../testUtils/renderUtils';
import ExpensesTimeWindow from '../ExpensesTimeWindow';

const mockSetOverviewInputWithDay = jest.fn();

jest.mock('@store', () => ({
  appStore: jest.fn((selector) => {
    return {
      dateState: { day: 15, month: 5, year: 2025 },
      setOverviewInputWithDay: mockSetOverviewInputWithDay,
    };
  }),
  TimeWindow: {
    DAY: 'DAY',
    MONTH: 'MONTH',
    YEAR: 'YEAR',
  },
}));

describe('ExpensesTimeWindow component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correct title and controls', () => {
    renderWithProviders(<ExpensesTimeWindow />);
    expect(screen.getByText('Expenses Period')).toBeDefined();

    // Dropdowns should render June and 2026 as default values
    const selectElements = screen.getAllByRole('combobox');
    expect(selectElements.length).toBe(2);

    const monthSelect = selectElements[0] as HTMLSelectElement;
    const yearSelect = selectElements[1] as HTMLSelectElement;

    expect(monthSelect.value).toBe('5'); // June (index 5)
    expect(yearSelect.value).toBe('2025');
  });

  it('should call setOverviewInputWithDay on left/right click', () => {
    renderWithProviders(<ExpensesTimeWindow />);
    const buttons = screen.getAllByRole('button');

    // Left button click
    fireEvent.click(buttons[0]);
    expect(mockSetOverviewInputWithDay).toHaveBeenCalled();

    // Right button click
    fireEvent.click(buttons[1]);
    expect(mockSetOverviewInputWithDay).toHaveBeenCalledTimes(2);
  });

  it('should call setOverviewInputWithDay on month/year select changes', () => {
    renderWithProviders(<ExpensesTimeWindow />);
    const selectElements = screen.getAllByRole('combobox');

    // Change month
    fireEvent.change(selectElements[0], { target: { value: '8' } }); // September
    expect(mockSetOverviewInputWithDay).toHaveBeenCalledWith({
      day: 15,
      month: 8,
      year: 2025,
    });

    // Change year
    fireEvent.change(selectElements[1], { target: { value: '2025' } });
    expect(mockSetOverviewInputWithDay).toHaveBeenCalledWith({
      day: 15,
      month: 5,
      year: 2025,
    });
  });
});
