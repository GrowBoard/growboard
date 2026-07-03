import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../testUtils/renderUtils';
import { InputText } from '../InputText';
import { InputType } from '../types';

describe('InputText component', () => {
  const defaultProps = {
    labelTitle: 'Test Label',
    defaultValue: 'initial',
    placeholder: 'Enter text',
    updateFormValue: jest.fn(),
    updateType: 'testField',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders label and placeholder', () => {
    renderWithProviders(<InputText {...defaultProps} />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders initial default value', () => {
    renderWithProviders(<InputText {...defaultProps} />);
    expect(screen.getByPlaceholderText('Enter text')).toHaveValue('initial');
  });

  it('updates input value on change and calls updateFormValue', () => {
    renderWithProviders(<InputText {...defaultProps} />);
    const input = screen.getByPlaceholderText('Enter text');
    fireEvent.change(input, { target: { value: 'new value' } });
    expect(input).toHaveValue('new value');
    expect(defaultProps.updateFormValue).toHaveBeenCalledWith({
      updateType: 'testField',
      value: 'new value',
    });
  });

  it('toggles password visibility when eye icon clicked', () => {
    renderWithProviders(<InputText {...defaultProps} type={InputType.PASSWORD} />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toHaveAttribute('type', 'password');

    // Click the eye icon container (which triggers handleVisibility)
    const eyeBtn = input.nextSibling;
    expect(eyeBtn).toBeInTheDocument();
    if (eyeBtn) {
      fireEvent.click(eyeBtn as HTMLElement);
      expect(input).toHaveAttribute('type', 'text');
      fireEvent.click(eyeBtn as HTMLElement);
      expect(input).toHaveAttribute('type', 'password');
    }
  });

  it('renders red border when errorState is true', () => {
    renderWithProviders(<InputText {...defaultProps} errorState={true} />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toHaveStyle({ borderColor: 'red.500' });
  });

  it('disables input when disabled is true', () => {
    renderWithProviders(<InputText {...defaultProps} disabled={true} />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeDisabled();
  });
});
