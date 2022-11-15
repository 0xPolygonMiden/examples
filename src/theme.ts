import { createTheme } from "@mui/material/styles";

// A custom theme with Polygon Miden branding
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#7b3fe4",
    },
    secondary: {
      main: "#efe2fe",
    },
    background: {
      default: "#fafafa",
    },
  },
});

export default theme;
