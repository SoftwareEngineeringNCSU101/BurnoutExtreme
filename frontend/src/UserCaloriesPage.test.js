import { render, screen } from '@testing-library/react';
import UserCaloriesPage from './components/UserCaloriesPage';

test('renders the landing page', () => {
  render(<UserCaloriesPage />);
});