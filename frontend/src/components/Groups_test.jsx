// frontend/src/components/Groups_test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Groups from './Groups';

describe('Groups', () => {
  it('renders group list and add group dialog', () => {
    render(<Groups />);
    expect(screen.getByText(/Groups/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Add Group/i));
    expect(screen.getByText(/Add Group/i)).toBeInTheDocument();
  });
});
