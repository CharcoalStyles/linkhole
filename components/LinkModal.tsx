import styled from "@emotion/styled";
import {
  Box,
  BoxProps,
  Button,
  FormControl,
  FormGroup,
  FormLabel,
  Grid,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { Link } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";
import { colours } from "../src/theme";

type LinkModalProps = {
  link?: Link;
  open: boolean;
  onClose: () => void;
  onUpdate: (link: Link) => void;
};
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  p: 1,
};

export const LinkModal = ({
  link,
  onClose,
  onUpdate,
  open,
}: LinkModalProps) => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (link) {
      setTitle(link.title);
      setUrl(link.url);
    }
  }, [link]);

  const [processing, setProcessing] = useState(false);

  return (
    <Modal
      open={open}
      onClose={() => {
        if (processing) return;
        onClose();
      }}
    >
      <Box sx={style}>
        <Box padding={2}>
          <Typography
            color="white"
            variant="h3"
            style={{
              textShadow: `0.1em 0.1em 0.1em black`,
            }}
          >
            New Link
          </Typography>
        </Box>
        <Box padding={1}>
          <TextField
            variant="filled"
            style={{ background: "white" }}
            color="secondary"
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Box>
        <Box padding={1}>
          <TextField
            variant="filled"
            style={{ background: "white" }}
            color="secondary"
            fullWidth
            label="Url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </Box>

        <Grid container justifyContent="flex-end" paddingTop={2}>
          <Grid item paddingRight={1}>
            <Button
              variant="contained"
              color="warning"
              onClick={onClose}
              disabled={processing}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              disabled={processing || title === "" || url === ""}
              onClick={async () => {
                setProcessing(true);
                const data = link
                  ? await updateLink(link.id, title, url)
                  : await createLink(title, url);
                setTitle("");
                setUrl("");
                setProcessing(false);
                onClose();
                onUpdate(data);
              }}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

const createLink = async (title: string, url: string) => {
  const { data } = await axios.post<Link>("/api/link", { title, url });
  return data;
};

const updateLink = async (id: number, title: string, url: string) => {
  const { data } = await axios.put<Link>(`/api/link/${id}`, { title, url });
  return data;
};
