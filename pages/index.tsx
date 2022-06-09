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
import useSWR from "swr";

const fetcher = (url: string, readToken: string) =>
  axios
    .get(url, {
      headers: {
        authorization: readToken,
      },
    })
    .then((res) => {
      console.log("swr", res.data);
      return res.data;
    });

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
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [setAuthModalOpen, setSetAuthModalOpen] = useState(false);
  const [canRead, setCanRead] = useState(false);
  const [canWrite, setCanWrite] = useState(false);
  const { data, error, mutate } = useSWR<LinkData[]>(
    ["/api/link", auth.read],
    fetcher, {}
  );

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
        mutate();
      });
    axios
      .post(
        "/api/check",
        {},
        {
          headers: { authorization: auth.write },
        }
      )
      .then((res) => setCanWrite(res.status === 200))
      .catch(() => setCanRead(false));
  }, [auth]);

  useEffect(() => {
    if (canRead) {
      mutate();
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
            mutate([link, ...(data || [])]);
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
        {data && (
          <LinksList links={data} updateLinks={(links) => mutate(links)} />
        )}
      </AuthContext.Provider>
    </>
  );
};

export default Home;
