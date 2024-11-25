import { render, screen } from '@testing-library/react';
import Home from './components/Home';
import { ThemeProvider } from './components/ThemeContext';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// Mock ResizeObserver if it's used in your components
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

const mockProps = {
  state: {
    token: 'mockToken'
  },
};

test('renders the landing page', () => {
  render(
    <ThemeProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Home {...mockProps} />
      </LocalizationProvider>
    </ThemeProvider>
  );
  
  // Add assertions here if needed
});