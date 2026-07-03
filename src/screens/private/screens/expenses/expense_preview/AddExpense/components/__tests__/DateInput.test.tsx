import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../../../../testUtils/renderUtils';
import DateInput from '../DateInput';

describe('DateInput component', () => {
  const mockSetValue = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with label and initial value', () => {
    const { container } = renderWithProviders(
      <DateInput
        text="Target Date"
        value="2026-07-03"
        maxValue="2026-07-10"
        setValue={mockSetValue}
      />,
    );

    expect(screen.getByText('Target Date')).toBeInTheDocument();
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe('2026-07-03');
    expect(input.max).toBe('2026-07-10');
  });

  it('calls setValue on change event', () => {
    const { container } = renderWithProviders(
      <DateInput
        text="Target Date"
        value="2026-07-03"
        maxValue="2026-07-10"
        setValue={mockSetValue}
      />,
    );

    const input = container.querySelector('input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '2026-07-05' } });

    expect(mockSetValue).toHaveBeenCalledWith('2026-07-05');
  });
});
