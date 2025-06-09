// frontend/src/components/Chatbot_test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Chatbot from './Chatbot';

describe('Chatbot', () => {
  it('renders FAQ and chatbot UI', () => {
    render(<Chatbot />);
    expect(screen.getByText(/Chatbot \/ FAQ/i)).toBeInTheDocument();
    expect(screen.getByText(/Frequently Asked Questions/i)).toBeInTheDocument();
    expect(screen.getByText(/Ask a Question/i)).toBeInTheDocument();
  });
});
