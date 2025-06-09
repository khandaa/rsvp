// frontend/src/components/RsvpDashboard_test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import RsvpDashboard from './RsvpDashboard';

describe('RsvpDashboard', () => {
  it('renders dashboard header', () => {
    render(<RsvpDashboard />);
    expect(screen.getByText(/RSVP Status Dashboard/i)).toBeInTheDocument();
  });
});
