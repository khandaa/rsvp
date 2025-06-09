// frontend/src/components/GuestForm_test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GuestForm from './GuestForm';

describe('GuestForm', () => {
  it('renders and submits form', () => {
    const onSave = jest.fn();
    render(<GuestForm open={true} onClose={() => {}} onSave={onSave} />);
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByText(/save/i));
    expect(onSave).toHaveBeenCalled();
  });
});
