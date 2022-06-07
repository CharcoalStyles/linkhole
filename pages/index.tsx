import { ConnectingAirportsOutlined } from "@mui/icons-material";
import { AppBar, Toolbar, Grid, Typography, Button } from "@mui/material";
import { Link as LinkData } from "@prisma/client";
import axios from "axios";
import type { NextPage } from "next";
import Head from "next/head";
import { createContext, useEffect, useState } from "react";
import { AuthModal } from "../components/AuthModal";
import { LinkModal } from "../components/LinkModal";
import { LinksList } from "../components/LinksList";

export type Auth = {
  read: string;
  write: string;
};

export const AuthContext = createContext<Auth>({
  read: "",
  write: "",
});

const Home: NextPage = () => {
  const [auth, setAuth] = useState<Auth>({ read: "", write: "" });
  const [links, setLinks] = useState<LinkData[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [setAuthModalOpen, setSetAuthModalOpen] = useState(false);
  const [canRead, setCanRead] = useState(false);
  const [canWrite, setCanWrite] = useState(false);

  useEffect(() => {
    axios
      .get("/api/check", {
        headers: {
          authorization: auth.read,
        },
      })
      .then((res) => setCanRead(res.status === 200))
      .catch(() => {
        setCanRead(false);
        setLinks([]);
      });
    axios
      .post(
        "/api/check",
        {},
        {
          headers: { authorization: auth.read },
        }
      )
      .then((res) => setCanWrite(res.status === 200))
      .catch(() => setCanRead(false));
  }, [auth]);

  useEffect(() => {
    if (canRead) {
      axios
        .get<LinkData[]>("/api/link", {
          headers: {
            authorization: auth.read,
          },
        })
        .then(({ data }) => setLinks(data));
    }
  }, [canRead]);

  return (
    <>
      <Head>
        <title>Linkhole</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AuthContext.Provider value={auth}>
        <LinkModal
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onUpdate={(link) => {
            setAddModalOpen(false);
            setLinks((prev) => [link, ...prev]);
          }}
        />
      </AuthContext.Provider>
      <AuthModal
        open={setAuthModalOpen}
        onClose={() => setSetAuthModalOpen(false)}
        onUpdate={(auth) => {
          setSetAuthModalOpen(false);
          setAuth(auth);
        }}
        auth={auth}
      />
      <AppBar position="sticky" elevation={4}>
        <Toolbar>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h1">Linkhole</Typography>
            </Grid>
            <Grid item>
              {canWrite ? (
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => setAddModalOpen(true)}
                >
                  Add New Link
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => setSetAuthModalOpen(true)}
                >
                  Login
                </Button>
              )}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <AuthContext.Provider value={auth}>
        <LinksList links={links} updateLinks={(links) => setLinks(links)} />
      </AuthContext.Provider>
    </>
  );
};

export default Home;
