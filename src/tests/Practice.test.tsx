import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Practice from '../pages/Practice';

describe('PracticeHub Page', () => {
  beforeEach(() => {
    render(<Practice />);
  });

  test('renders PracticeHub heading', () => {
    const heading = screen.getByRole('heading', { name: /practice hub/i });
    expect(heading).toBeInTheDocument();
  });

  test('interacts with PracticeHub key UI elements', () => {
    const startButton = screen.queryByRole('button', { name: /start practice/i });
    if (startButton) {
      fireEvent.click(startButton);
      // Add assertions for expected behavior after clicking start practice
    }
  });
});
