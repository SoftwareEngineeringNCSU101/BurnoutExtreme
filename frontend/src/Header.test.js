// import { render, screen } from '@testing-library/react';
// import Header from './components/Header';

// test('renders the landing page', () => {
//   render(<Header />);
// });import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from './components/Header'; 
import { ThemeProvider } from './components/ThemeContext';
import { GoogleOAuthProvider } from '@react-oauth/google'; 

const clientId = 'YOUR_GOOGLE_CLIENT_ID';

test('renders the landing page', () => {
  render(
    <MemoryRouter>
      <GoogleOAuthProvider clientId={clientId}> 
        <ThemeProvider>
          <Header />
        </ThemeProvider>
      </GoogleOAuthProvider>
    </MemoryRouter>
  );

});