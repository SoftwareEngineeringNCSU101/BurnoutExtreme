import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Link } from '@mui/material';

function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary">
            {'Copyright © '}
            {new Date().getFullYear()}{' '}
                Aditya Iyer, Aditi Killedar, Shashank U M, Srinath Srinivasan
            {'.'}
        </Typography>
    );
}

const defaultTheme = createTheme();

export default function Footer() {
    return (
        <ThemeProvider theme={defaultTheme}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '43vh',
                }}
            >
                <CssBaseline />
                <Box
                    component="footer"
                    sx={{
                        py: 3,
                        px: 2,
                        mt: 'auto',
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[200]
                                : theme.palette.grey[800],
                    }}
                >
                    <Container maxWidth="sm">
                        <div align="center">
                            <Link variant="body2" href="https://github.com/adi-kiran/burnout-healthgoalsapp/blob/main/LICENSE" color="text.secondary" align="center">
                                MIT License
                            </Link>
                        </div>

                        <Copyright />
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
