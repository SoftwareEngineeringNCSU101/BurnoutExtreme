import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Link } from '@mui/material';

function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary" align="center"
        sx={{
            fontSize: { xs: '0.8rem', sm: '0.875rem' },
            lineHeight: { xs: 1.4, sm: 1.5 },
            padding: { xs: '0.5rem', sm: '1rem' }
        }}
        >
            {'Copyright © '}
            {new Date().getFullYear()}{' '}
            Dinesh Kannan, Harshwardhan Patil, Sakshi Phatak. <br />
            <Box component="span" display="block" mt={1}>
                {'BurnoutExtreme is built on top of the original Burnout application.'}
            </Box>

            
        </Typography>
    );
}


const defaultTheme = createTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1920,
        },
    },
});

export default function Footer() {
    return (
        <ThemeProvider theme={defaultTheme}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    inHeight: { xs: '30vh', sm: '43vh' },
                    width: '100%'
                }}
            >
                <CssBaseline />
                <Box
                    component="footer"
                    sx={{
                        py: { xs: 2, sm: 3 },
                        px: { xs: 1, sm: 2 },
                        mt: 'auto',
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[200]
                                : theme.palette.grey[800],
                        width: '100%'
                    }}
                >
                    <Container maxWidth="sm"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: { xs: 1, sm: 2 }
                    }}
                    >
                        <Box 
                            align="center"
                            sx={{
                                '& a': {
                                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                    transition: 'color 0.2s ease',
                                    '&:hover': {
                                        color: 'primary.main'
                                    }
                                }
                            }}
                        >
                            <Link 
                                variant="body2" 
                                href="https://github.com/SoftwareEngineeringNCSU101/BurnoutExtreme.git" 
                                color="text.secondary"
                            >
                                MIT License
                            </Link>
                        </Box>
                        <Copyright />
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
