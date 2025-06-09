// frontend/src/components/GuestList_test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GuestList from './GuestList';

describe('GuestList', () => {
  it('renders guest list and filters by search', () => {
    const guests = [
      { id: 1, name: 'Alice', email: 'alice@example.com', phone: '123', group_id: 1, rsvp_status: 'attending' },
      { id: 2, name: 'Bob', email: 'bob@example.com', phone: '456', group_id: 2, rsvp_status: 'no_response' },
    ];
    render(<GuestList onEditGuest={() => {}} guests={guests} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/search guests/i), { target: { value: 'Alice' } });
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).not.toBeInTheDocument();
  });
});
