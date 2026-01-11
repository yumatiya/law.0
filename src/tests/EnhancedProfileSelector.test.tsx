import { render, fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { EnhancedProfileSelector } from '../components/EnhancedProfileSelector';

describe('EnhancedProfileSelector', () => {
  // Mock implementation for onProfileSelect prop
  const mockOnProfileSelect = jest.fn();

  beforeEach(() => {
    mockOnProfileSelect.mockClear();
    // Clear localStorage before each test
    localStorage.clear();
    // Reset window location
    delete window.location;
    window.location = { pathname: '/' };
  });

  it('renders all profiles by default', () => {
    render(<EnhancedProfileSelector onProfileSelect={mockOnProfileSelect} />);
    // Check for a profile title that should appear by default
    expect(screen.getByText('School Mode')).toBeInTheDocument();
    expect(screen.getByText('College Mode')).toBeInTheDocument();
    expect(screen.getByText('Lawyer Mode')).toBeInTheDocument();
    expect(screen.getByText('Professional Mode')).toBeInTheDocument();
    expect(screen.getByText('Expert Mode')).toBeInTheDocument();
    expect(screen.getByText('Community Mode')).toBeInTheDocument();
  });

  it('filters profiles by selected level', () => {
    render(<EnhancedProfileSelector onProfileSelect={mockOnProfileSelect} />);
    // Click on "advanced" level filter button
    fireEvent.click(screen.getByText('advanced'));
    // Expect advanced profiles visible
    expect(screen.queryByText('School Mode')).toBeNull();
    expect(screen.getByText('College Mode')).toBeInTheDocument();
    expect(screen.getByText('Lawyer Mode')).toBeInTheDocument();
    expect(screen.queryByText('Professional Mode')).toBeNull();
  });

  it('calls onProfileSelect when profile button clicked', () => {
    render(<EnhancedProfileSelector onProfileSelect={mockOnProfileSelect} />);
    fireEvent.click(screen.getByText('Select Lawyer Mode'));
    expect(mockOnProfileSelect).toHaveBeenCalledWith('lawyer');
  });

  it('updates window.location.pathname when profile selected', () => {
    // Assume the component or consumer updates URL on profile select, simulate here:
    render(<EnhancedProfileSelector onProfileSelect={(id) => { window.location.pathname = `/${id}`; }} />);
    fireEvent.click(screen.getByText('Select School Mode'));
    expect(window.location.pathname).toBe('/school');
  });

  it('displays popular badge for profiles marked popular', () => {
    render(<EnhancedProfileSelector onProfileSelect={mockOnProfileSelect} />);
    expect(screen.getByText('Popular')).toBeInTheDocument();
  });
});
