import { render, screen } from '@testing-library/react';
import Profile from './components/Profile';

test('renders the landing page', () => {
  render(<Profile />);
});