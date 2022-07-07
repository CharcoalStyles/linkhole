import { createTheme } from "@mui/material";

export const colours = {
  light: ["#E27D60", "#85DCB0", "#E8A87C", "#C38D9E", "#85B0DC"],
  dark: ["#5a2111", "#1a5b3b", "#643212", "#492732", "#163c37"],
};

const largeHeadings = {
  fontFamily: "'Patua One'",
  fontWeight: 600,
};
const smallHeadings = {
  fontFamily: "'Patua One'",
  fontWeight: 400,
};

export const fadeProperty = `linear-gradient(90deg, ${colours.light[1]} 0%, ${colours.light[1]} 30%, ${colours.light[4]} 100%)`;

export const backgroundFade = {
  background: fadeProperty,
};

export const theme = createTheme({
  typography: {
    fontFamily: "'Didact Gothic', sans-serif",
    fontWeightRegular: 600,
    h1: {
      ...largeHeadings,
      fontSize: "3rem",
    },
    h2: {
      ...largeHeadings,
      fontSize: "2.75rem",
    },
    h3: {
      ...largeHeadings,
      fontSize: "2.5rem",
      fontWeight: 600,
    },
    h4: {
      ...smallHeadings,
      fontSize: "2.25rem",
    },
    h5: {
      ...smallHeadings,
      fontSize: "2rem",
    },
    h6: {
      ...smallHeadings,
      fontSize: "1.5rem",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: fadeProperty,
        },
      },
    },
  },
  palette: {
    primary: {
      main: colours.light[1],
      contrastText: "#111",
    },
    secondary: {
      main: colours.light[4],
      contrastText: "#111",
    },
  },
});
