import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Defina suas variáveis CSS como um objeto JavaScript
const cssVariables = {
  '--primary-bg': 'rgba(36, 36, 36, 1)',
  '--color-text': 'rgba(255, 255, 255, 0.87)',
  '--primary-hover-bg': 'rgba(36, 36, 36, 0.585)',
  '--secondary-bg': 'rgb(26, 26, 26)',
  '--secondary-text': 'rgb(249, 249, 249)',
  '--secondary-hover-bg': 'rgb(90, 90, 90)',
};

// Crie seu tema personalizado aqui
const theme = createTheme({
  palette: {
    primary: {
      main: cssVariables['--primary-bg'],
      contrastText: cssVariables['--color-text'],
    },
    secondary: {
      main: cssVariables['--secondary-bg'],
      contrastText: cssVariables['--secondary-text'],
    },
    background: {
      default: cssVariables['--primary-bg'],
    },
    text: {
      primary: cssVariables['--color-text'],
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    h1: {
      fontSize: '3.2em',
      lineHeight: 1.1,
    },
    body1: {
      lineHeight: 1.5,
      fontWeight: 400,
    },
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '0.6em 1.2em',
          fontSize: '1em',
          fontWeight: 500,
          backgroundColor: cssVariables['--secondary-bg'],
          '&:hover': {
            borderColor: '#646cff',
          },
          '&:focus, &:focus-visible': {
            outline: '4px auto -webkit-focus-ring-color',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          textDecoration: 'inherit',
          '&:hover': {
            color: cssVariables['--primary-hover-bg'],
          },
        },
      },
    },
  },
});

export default theme;
