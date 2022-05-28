import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "../styles/createEmotionCache";
import Header from "../components/Header";
import Footer from "../components/Footer";

import "/styles/globals.css";
import "/styles/Footer.css";
import "/styles/slider.css";
import theme from "../styles/theme";
import AuctionCard from "../components/AuctionCard";
import { makeStyles } from "@mui/styles";
import { Toaster } from "react-hot-toast";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const useStyles = makeStyles((theme) => ({
    root: {
      minHeight: "100vh",
      backgroundColor: "#110E0E",
    },
  }));

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>RobinMania Marketplace</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
        <Toaster />

        <Component {...pageProps} />

        <Footer />
      </ThemeProvider>
    </CacheProvider>
  );
}
