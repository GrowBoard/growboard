import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CheckIcon } from '../CheckIcon';

describe('CheckIcon component', () => {
  it('renders checkmark SVG icon', () => {
    const { container } = render(<CheckIcon />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
