import { render, screen } from '@testing-library/react';
import PrivateRoute from './components/PrivateRoute';

test('renders the landing page', () => {
  render(<PrivateRoute />);
});