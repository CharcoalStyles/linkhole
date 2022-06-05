import { AppBar, Toolbar, Grid, Typography, Button } from "@mui/material";
import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Linkhole</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Didact+Gothic&family=Patua+One&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <AppBar position="sticky" elevation={4}>
        <Toolbar>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h1">Linkhole</Typography>
            </Grid>
            <Grid item>
              <Button variant="contained" size="large">
                Add New Link
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Grid
        paddingX={4}
        paddingTop={2}
        container
        flexDirection="column"
        justifyContent="start"
      >
        {Array(1000)
          .fill("")
          .map((x, i) => {
            return (
              <Grid item key={i}>
                <Typography variant="h2">{i}</Typography>
              </Grid>
            );
          })}
      </Grid>
    </>
  );
};

export default Home;
