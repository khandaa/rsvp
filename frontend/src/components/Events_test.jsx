// frontend/src/components/Events_test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Events from './Events';

describe('Events', () => {
  it('renders event list and add event dialog', () => {
    render(<Events />);
    expect(screen.getByText(/Events/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Add Event/i));
    expect(screen.getByText(/Add Event/i)).toBeInTheDocument();
  });
});
