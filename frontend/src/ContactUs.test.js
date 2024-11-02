// import { render, screen } from '@testing-library/react';
// import ContactUs from './components/ContactUs';

// test('renders the landing page', () => {
//   render(<ContactUs />);
//   expect(screen.getByText(/Contact Us/i)).toBeInTheDocument
//   expect(screen.getByRole("button")).toBeInTheDocument



import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ContactUs from './components/ContactUs';
import { ThemeProvider } from './components/ThemeContext';
import { GoogleOAuthProvider } from '@react-oauth/google'; 

const clientId = 'YOUR_GOOGLE_CLIENT_ID';

test('renders the landing page', () => {
  render(
    <MemoryRouter>
      <GoogleOAuthProvider clientId={clientId}> 
        <ThemeProvider>
          <ContactUs />
        </ThemeProvider>
      </GoogleOAuthProvider>
    </MemoryRouter>
  );

});