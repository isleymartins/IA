import { alpha, createTheme, getContrastRatio } from '@mui/material/styles';
import { red } from '@mui/material/colors';

const colorBasePrimaryDark = 'rgba(36, 36, 36, 264)'
const colorMainPrimaryDark = alpha(colorBasePrimaryDark, 0.7)

const colorBaseSecondaryDark = '#19857b'
const colorMainSecondaryDark = alpha(colorBaseSecondaryDark, 0.7)

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: colorMainPrimaryDark,
      contrastText: getContrastRatio(colorMainPrimaryDark, '#202124') < 4.5 ? '#fff' : '#111',
    },
    secondary: {
      main: colorMainSecondaryDark,
    },
    error: {
      main: red.A400,
    },
    background: {
      paper: "#f2f2f2",
      default:  colorMainPrimaryDark
    },
    
  },
});

export default theme;
