import { createTheme } from "@mui/material/styles";

// A custom theme for this app
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0052cc",
    },
    secondary: {
      main: "#edf2ff",
    },
    background: {
      default: "#f5f5f5",
    },
  },
});

export default theme;
