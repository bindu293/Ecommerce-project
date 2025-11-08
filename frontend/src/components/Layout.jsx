import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff9900',
    },
    secondary: {
      main: '#007bff',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
});

const Layout = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
          {children}
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default Layout;