import { render, screen } from '@testing-library/react';
import Header from './components/Header';

test('renders the landing page', () => {
  render(<Header />);
});