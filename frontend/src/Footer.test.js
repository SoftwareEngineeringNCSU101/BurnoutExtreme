import { render, screen } from '@testing-library/react';
import Footer from './components/Footer';

test('renders the landing page', () => {
  render(<Footer />);
  expect(screen.getByText(/Aditya Iyer, Aditi Killedar, Shashank Udyavar Madan, Srinath Srinivasan/i)).toBeInTheDocument
});