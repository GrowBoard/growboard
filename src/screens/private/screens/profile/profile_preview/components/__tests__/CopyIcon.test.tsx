import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CopyIcon } from '../CopyIcon';

describe('CopyIcon component', () => {
  it('renders copy SVG icon', () => {
    const { container } = render(<CopyIcon />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
