import { render, screen } from '@testing-library/react';
import Events from './components/Events';

test('renders the landing page', () => {
  render(<Events />);
});