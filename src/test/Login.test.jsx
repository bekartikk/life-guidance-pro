import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from './helpers.jsx';
import Login from '../components/Login.jsx';

describe('Login Component', () => {
  it('should render the login form correctly', () => {
    renderWithProviders(<Login />);
    
    // Check if the login form elements are present
    expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Minimum 6 characters/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Enter dashboard/i })).toBeInTheDocument();
  });
});
