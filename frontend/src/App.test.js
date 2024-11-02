import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './components/App'; 
import { ThemeProvider } from './components/ThemeContext';
import { GoogleOAuthProvider } from '@react-oauth/google'; 

const clientId = 'YOUR_GOOGLE_CLIENT_ID';

test('renders the landing page', () => {
  render(
    <MemoryRouter>
      <GoogleOAuthProvider clientId={clientId}> 
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </GoogleOAuthProvider>
    </MemoryRouter>
  );

});