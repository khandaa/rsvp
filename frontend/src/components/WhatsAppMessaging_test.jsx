// frontend/src/components/WhatsAppMessaging_test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WhatsAppMessaging from './WhatsAppMessaging';

describe('WhatsAppMessaging', () => {
  it('renders WhatsApp messaging UI', () => {
    render(<WhatsAppMessaging />);
    expect(screen.getByText(/WhatsApp Messaging/i)).toBeInTheDocument();
    expect(screen.getByText(/Send WhatsApp Message/i)).toBeInTheDocument();
  });
});
