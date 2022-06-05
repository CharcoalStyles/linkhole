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
} from "@mui/material";
import { Link } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

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
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
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
        console.log({ link, title, url });
        if (processing) return;
        onClose();
      }}
    >
      <Box sx={style}>
        <Box padding={1}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Box>
        <Box padding={1}>
          <TextField
            label="Url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </Box>

        <Grid container justifyContent="flex-end">
          <Grid item>
            <Button onClick={onClose} disabled={processing}>
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              disabled={processing || title === "" || url === ""}
              onClick={async () => {
                setProcessing(true);
                const data = link
                  ? await updateLink(link.id, title, url)
                  : await createLink(title, url);
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
