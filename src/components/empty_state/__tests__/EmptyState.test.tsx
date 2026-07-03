import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../testUtils/renderUtils';
import { EmptyState } from '../EmptyState';

describe('EmptyState component', () => {
  it('renders the title', () => {
    renderWithProviders(<EmptyState title="Nothing here yet" />);
    expect(screen.getByText('Nothing here yet')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    renderWithProviders(
      <EmptyState title="Empty" description="Add something to get started" />,
    );
    expect(
      screen.getByText('Add something to get started'),
    ).toBeInTheDocument();
  });

  it('does not render description when omitted', () => {
    renderWithProviders(<EmptyState title="No Items" />);
    expect(screen.queryByText(/Add something/)).not.toBeInTheDocument();
  });

  it('renders the CTA button with default label when onButtonClick is provided', () => {
    const onClick = jest.fn();
    renderWithProviders(<EmptyState title="Empty" onButtonClick={onClick} />);
    expect(screen.getByRole('button', { name: /Add/i })).toBeInTheDocument();
  });

  it('calls onButtonClick when CTA button is clicked', () => {
    const onClick = jest.fn();
    renderWithProviders(<EmptyState title="Empty" onButtonClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: /Add/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onAdd when provided and no onButtonClick', () => {
    const onAdd = jest.fn();
    renderWithProviders(<EmptyState title="Empty" onAdd={onAdd} />);
    fireEvent.click(screen.getByRole('button', { name: /Add/i }));
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it('renders custom button label', () => {
    renderWithProviders(
      <EmptyState
        title="Empty"
        buttonText="Create New"
        onButtonClick={jest.fn()}
      />,
    );
    expect(
      screen.getByRole('button', { name: /Create New/i }),
    ).toBeInTheDocument();
  });

  it('hides button when neither onButtonClick nor onAdd provided', () => {
    renderWithProviders(<EmptyState title="Empty" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
