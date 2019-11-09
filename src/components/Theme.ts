import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    background: {
      default: '#fff'
    },
    primary: {
      light: "#ffffff",
      main: "#eeeeee",
      dark: "#bcbcbc",
      contrastText: "#000000",
    },
    secondary: {
      light: "#bf360c",
      main: "#bf360c",
      dark: "#870000",
      contrastText: "#ffffff",
    },
  },
  typography: {
    button: {
      textTransform: 'none'
    }
  }
});

export default theme;
