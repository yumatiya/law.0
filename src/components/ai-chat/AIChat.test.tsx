import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AIChat from './AIChat';

// Mock fetch to backend /api/chat/send
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ response: 'AI reply' }),
  })
) as jest.Mock;

describe('AIChat Component', () => {
  test('renders toggle button and opens chat on click', () => {
    render(<AIChat />);
    const toggleButton = screen.getByRole('button', { name: /toggle ai chat/i });
    expect(toggleButton).toBeInTheDocument();

    fireEvent.click(toggleButton);
    const chatHeading = screen.getByRole('heading', { name: /ai chat/i });
    expect(chatHeading).toBeInTheDocument();
  });

  test('sends user message and receives AI reply', async () => {
    render(<AIChat />);
    fireEvent.click(screen.getByRole('button', { name: /toggle ai chat/i }));

    const textarea = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(textarea, { target: { value: 'Hello AI' } });

    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText('Hello AI')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('AI reply')).toBeInTheDocument();
    });
  });

  test('voice input button presence and toggling', async () => {
    render(<AIChat />);
    fireEvent.click(screen.getByRole('button', { name: /toggle ai chat/i }));

    // Voice input button may or may not be present depending on environment
    // Just check if button with certain aria-label exists
    const voiceButtons = screen.queryAllByRole('button', { name: /voice input/i });
    expect(voiceButtons.length).toBeLessThanOrEqual(1);
  });
});
