import { render, screen } from '@testing-library/react';
import ContactUs from './components/ContactUs';

test('renders the landing page', () => {
  render(<ContactUs />);
  expect(screen.getByText(/Contact Us/i)).toBeInTheDocument
  expect(screen.getByRole("button")).toBeInTheDocument
});