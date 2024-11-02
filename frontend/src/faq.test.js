// import { render, screen } from '@testing-library/react';
// import FAQ from './components/faq';

// test('renders the landing page', () => {
//   render(<FAQ />);
//   expect(screen.getByText(/What is TDEE?/i)).toBeInTheDocument
//   expect(screen.getByText(/What is BMI?/i)).toBeInTheDocument
//   expect(screen.getByText(/What should I do if I encounter technical issues with the app?/i)).toBeInTheDocument
//   expect(screen.getByText(/What is the recommended workout duration for beginners?/i)).toBeInTheDocument
//   expect(screen.getByText(/Is it okay to eat before a workout?/i)).toBeInTheDocument
//   expect(screen.getByText(/How do I calculate my daily calorie needs?/i)).toBeInTheDocument
// });

import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FAQ from './components/faq';
import { ThemeProvider } from './components/ThemeContext';
import { GoogleOAuthProvider } from '@react-oauth/google'; 

const clientId = 'YOUR_GOOGLE_CLIENT_ID';

test('renders the landing page', () => {
  render(
    <MemoryRouter>
      <GoogleOAuthProvider clientId={clientId}> 
        <ThemeProvider>
          <FAQ />
        </ThemeProvider>
      </GoogleOAuthProvider>
    </MemoryRouter>
  );

});