// import { render, screen } from '@testing-library/react';
// import Router from './components/Router';

// test('renders the landing page', () => {
//   render(<Router />);
// });

import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Router from './components/Router'; 
import { ThemeProvider } from './components/ThemeContext';
import { GoogleOAuthProvider } from '@react-oauth/google'; 

const clientId = 'YOUR_GOOGLE_CLIENT_ID';

test('renders the landing page', () => {
  render(
    <MemoryRouter>
      <GoogleOAuthProvider clientId={clientId}> 
        <ThemeProvider>
          <Router />
        </ThemeProvider>
      </GoogleOAuthProvider>
    </MemoryRouter>
  );

});