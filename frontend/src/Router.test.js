import { render, screen } from '@testing-library/react';
import Router from './components/Router';

test('renders the landing page', () => {
  render(<Router />);
});