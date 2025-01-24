import { createTheme } from '@mui/material/styles';

// First create a basic theme without component overrides
const baseTheme = createTheme({
  palette: {
    primary: {
      main: '#3a86ff',
      light: '#6ba3ff',
      dark: '#2b63cc',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#8338ec',
      light: '#a665ff',
      dark: '#5f00b9',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Inter", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
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

// Then create the final theme with component overrides using the base theme
const theme = createTheme({
  ...baseTheme,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 16,
          paddingRight: 16,
          [`@media (min-width: ${baseTheme.breakpoints.values.sm}px)`]: {
            paddingLeft: 24,
            paddingRight: 24,
          },
        },
      },
    },
  },
});

export default theme;