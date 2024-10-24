import { render, screen } from '@testing-library/react';
import Meals from './components/Meals';

test('renders the landing page', () => {
  render(<Meals />);
});