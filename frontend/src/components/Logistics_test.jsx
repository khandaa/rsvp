// frontend/src/components/Logistics_test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Logistics from './Logistics';

describe('Logistics', () => {
  it('renders logistics list and add logistics dialog', () => {
    render(<Logistics />);
    expect(screen.getByText(/Logistics/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Add Logistics/i));
    expect(screen.getByText(/Add Logistics/i)).toBeInTheDocument();
  });
});
