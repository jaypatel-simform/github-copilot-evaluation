import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders task management application', () => {
  render(<App />);
  const headingElement = screen.getByText(/Task Management/i);
  expect(headingElement).toBeInTheDocument();
});
