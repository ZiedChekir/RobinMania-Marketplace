import { createTheme, responsiveFontSizes } from "@mui/material/styles";


// Create a theme instance.
let theme = createTheme({
  palette: {
    primary:{
      light: '#272935',
      main: '#110E0E',
      dark: '#171212',
    } ,
    secondary:{
      light: '#5AFF3D',
      main: '#1EB854',
      dark: '#D99330',
    },
    lighter:{
      main:'#D99330',
    },
    background: {
      default: "#110E0E"
    }
  },
  typography: {
    fontFamily: 'Nunito'
  },
});

theme = responsiveFontSizes(theme);

export default theme;