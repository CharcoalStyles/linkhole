import { AppBar, Toolbar, Grid, Typography, Button } from "@mui/material";
import { Link as LinkData } from "@prisma/client";
import axios from "axios";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LinkModal } from "../components/LinkModal";
import { LinksList } from "../components/LinksList";

const Home: NextPage = () => {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  console.log({ links });

  useEffect(() => {
    axios.get<LinkData[]>("/api/link").then(({ data }) => setLinks(data));
  }, []);

  return (
    <>
      <Head>
        <title>Linkhole</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LinkModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onUpdate={(link) => {
          setModalOpen(false);
          setLinks((prev) => [...prev, link]);
        }}
      />
      <AppBar position="sticky" elevation={4}>
        <Toolbar>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h1">Linkhole</Typography>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                size="large"
                onClick={() => setModalOpen(true)}
              >
                Add New Link
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <LinksList links={links} updateLinks={(links) => setLinks(links)} />
    </>
  );
};

export default Home;
