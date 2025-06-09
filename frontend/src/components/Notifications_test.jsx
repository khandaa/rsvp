// frontend/src/components/Notifications_test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Notifications from './Notifications';

describe('Notifications', () => {
  it('renders notifications list and send notification dialog', () => {
    render(<Notifications />);
    expect(screen.getByText(/Notifications/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Send Notification/i));
    expect(screen.getByText(/Send Notification/i)).toBeInTheDocument();
  });
});
