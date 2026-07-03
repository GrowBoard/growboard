import '@testing-library/jest-dom';
import { PasswordEye } from '../PasswordEye';
import { InputType } from '../../types';
import { renderWithProviders } from '../../../../testUtils/renderUtils';

describe('PasswordEye component', () => {
  it('renders correctly for InputType.PASSWORD', () => {
    const { container } = renderWithProviders(<PasswordEye inputType={InputType.PASSWORD} />);
    // Check if SVG is rendered
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders correctly for InputType.TEXT', () => {
    const { container } = renderWithProviders(<PasswordEye inputType={InputType.TEXT} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
