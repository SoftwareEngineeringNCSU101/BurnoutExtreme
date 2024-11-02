// import { render, screen } from '@testing-library/react';
// import Footer from './components/Footer';

// test('renders the landing page', () => {
//   renderWithTheme(<Footer />);
//   expect(screen.getByText(/Aditya Iyer, Aditi Killedar, Shashank Udyavar Madan, Srinath Srinivasan/i)).toBeInTheDocument
// });


import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from './components/Footer';
import { ThemeProvider } from './components/ThemeContext';
import { GoogleOAuthProvider } from '@react-oauth/google'; 

const clientId = 'YOUR_GOOGLE_CLIENT_ID';

test('renders the landing page', () => {
  render(
    <MemoryRouter>
      <GoogleOAuthProvider clientId={clientId}> 
        <ThemeProvider>
          <Footer />
        </ThemeProvider>
      </GoogleOAuthProvider>
    </MemoryRouter>
  );

});