import { AppBar, Toolbar, Grid, Typography, Button } from "@mui/material";
import { Link as LinkData } from "@prisma/client";
import axios from "axios";
import type { NextPage } from "next";
import Head from "next/head";
import { createContext, useEffect, useState } from "react";
import { Alert } from "@mui/material";
import { Snackbar } from "@mui/material";
import { AuthModal } from "../components/AuthModal";
import { LinkModal } from "../components/LinkModal";
import { LinksList } from "../components/LinksList";

import useSWR from "swr";
import { useRouter } from "next/router";

const fetcher = (url: string, readToken: string) =>
  axios
    .get(url, {
      headers: {
        authorization: readToken,
      },
    })
    .then((res) => {
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
  const { query } = useRouter();

  const [auth, setAuth] = useState<Auth>({ read: "", write: "" });
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [setAuthModalOpen, setSetAuthModalOpen] = useState(false);

  const [canRead, setCanRead] = useState(false);
  const [canWrite, setCanWrite] = useState(false);
  const [showCantRead, setShowCantRead] = useState(false);
  const [showCantWrite, setShowCantWrite] = useState(false);

  const { data, mutate } = useSWR<LinkData[]>(
    ["/api/link", auth.read],
    fetcher
  );

  const [shareTitle, setShareTitle] = useState<string>();
  const [shareUrl, setShareUrl] = useState<string>();

  useEffect(() => {
    const readPassword = localStorage.getItem("readPassword");
    const writePassword = localStorage.getItem("writePassword");
    setAuth({
      read: readPassword ? readPassword : "",
      write: writePassword ? writePassword : "",
    });
  }, []);

  useEffect(() => {
    if (canRead) {
      mutate();
    }
    setShowCantRead(!canRead);
  }, [canRead]);
  useEffect(() => {
    setShowCantWrite(!canWrite);
  }, [canWrite]);

  useEffect(() => {
    axios
      .get("/api/check", {
        headers: {
          authorization: auth.read,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setCanRead(true);
          localStorage.setItem("readPassword", auth.read);
        } else {
          setCanRead(false);
        }
      })
      .catch(() => {
        setCanRead(false);
      });
    axios
      .post(
        "/api/check",
        {},
        {
          headers: { authorization: auth.write },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setCanWrite(true);
          localStorage.setItem("writePassword", auth.write);
        } else {
          setCanWrite(false);
        }
      })
      .catch(() => {
        setCanWrite(false);
        setShowCantWrite(true);
      });
  }, [auth]);

  useEffect(() => {
    console.log({ query });
    if (!canWrite) {
      setShowCantWrite(true);
      return;
    }
    if (query["url"] || query["title"]) {
      setShareTitle(
        Array.isArray(query["title"]) ? query["title"][0] : query["title"]
      );
      setShareUrl(Array.isArray(query["url"]) ? query["url"][0] : query["url"]);
      setAddModalOpen(true);
    }
  }, [query]);

  return (
    <>
      <Head>
        <title>Linkhole</title>
        <link rel="icon" href="/icons/icon-96x96.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png"></link>
        <meta name="theme-color" content="#85DCB0" />
      </Head>
      <AuthContext.Provider value={auth}>
        <LinkModal
          link={
            shareTitle && shareUrl
              ? { title: shareTitle, url: shareUrl }
              : undefined
          }
          open={addModalOpen}
          onClose={() => {
            setShareTitle("");
            setShareUrl("");
            setAddModalOpen(false);
          }}
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
          <LinksList
            canWrite={canWrite}
            links={data}
            updateLinks={(links) => mutate(links)}
          />
        )}
      </AuthContext.Provider>

      <Snackbar
        open={showCantRead}
        autoHideDuration={6000}
        onClose={() => {
          setShowCantRead(false);
        }}
      >
        <Alert severity="error">Read password not set or is incorrect</Alert>
      </Snackbar>

      <Snackbar
        open={showCantWrite}
        autoHideDuration={6000}
        onClose={() => {
          setShowCantWrite(false);
        }}
      >
        <Alert severity="warning">Write password not set or is incorrect</Alert>
      </Snackbar>
    </>
  );
};

export default Home;
