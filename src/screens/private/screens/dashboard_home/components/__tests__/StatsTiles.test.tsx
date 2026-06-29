import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../../testUtils/renderUtils';
import { StatsTiles } from '../StatsTiles';

describe('StatsTiles component', () => {
  const defaultProps = {
    goalsCount: 5,
    activeGoalsCount: 2,
    learningsCount: 10,
    credsCount: 3,
  };

  it('renders all four stat tiles', () => {
    renderWithProviders(<StatsTiles {...defaultProps} />);
    expect(screen.getByText('Total Goals')).toBeInTheDocument();
    expect(screen.getByText('Active Goals')).toBeInTheDocument();
    expect(screen.getByText('Learnings')).toBeInTheDocument();
    expect(screen.getByText('Credentials')).toBeInTheDocument();
  });

  it('displays the correct goals count', () => {
    renderWithProviders(<StatsTiles {...defaultProps} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('displays the correct active goals count', () => {
    renderWithProviders(<StatsTiles {...defaultProps} />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('displays the correct learnings count', () => {
    renderWithProviders(<StatsTiles {...defaultProps} />);
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('displays the correct credentials count', () => {
    renderWithProviders(<StatsTiles {...defaultProps} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders zero counts correctly', () => {
    renderWithProviders(
      <StatsTiles
        goalsCount={0}
        activeGoalsCount={0}
        learningsCount={0}
        credsCount={0}
      />,
    );
    const zeros = screen.getAllByText('0');
    expect(zeros).toHaveLength(4);
  });
});
