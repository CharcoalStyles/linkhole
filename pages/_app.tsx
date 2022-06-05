import type { AppProps } from "next/app";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { theme } from "../src/theme";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
