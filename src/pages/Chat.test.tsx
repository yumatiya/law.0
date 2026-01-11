import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Chat from './Chat';

describe('Chat Page', () => {
  test('renders Chat page without crashing', () => {
    const { getByRole } = render(<Chat />);
    const chatHeading = getByRole('heading', { level: 1, name: /chat/i });
    expect(chatHeading).toBeInTheDocument();
  });
});
