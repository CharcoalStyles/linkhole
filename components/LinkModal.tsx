import { Box, Button, Grid, Modal, TextField, Typography } from "@mui/material";
import { Link, Tag } from "@prisma/client";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../pages";
import { LinkApiResponse } from "../src/apiTypes";
import { TagList } from "./TagList";

type LinkModalProps = {
  link?: LinkApiResponse;
  open: boolean;
  onClose: () => void;
  onUpdate: (link: LinkApiResponse) => void;
};
export const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  p: 1,
  backgroundColor: "rgba(0,0,0,0.3)",
};

export const LinkModal = ({
  link,
  onClose,
  onUpdate,
  open,
}: LinkModalProps) => {
  const { write } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [tags, setTags] = useState<Array<Tag>>([]);

  useEffect(() => {
    if (link) {
      setTitle(link.title);
      setUrl(link.url);
      setTags(link.tags.map((t) => t.tag));
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
      <Box sx={modalStyle}>
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

        <Box padding={1}>
          <TagList
            onChange={(selectedTags) => setTags(selectedTags)}
            initTags={tags}
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
                const data =
                  link !== undefined && link.id
                    ? await updateLink(
                        link.id,
                        title,
                        url,
                        { new: tags, old: link.tags.map((t) => t.tag) },
                        write
                      )
                    : await createLink(title, url, tags, write);
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

const createLink = async (
  title: string,
  url: string,
  tags: Array<Tag>,
  writeAuth: string
) => {
  const { data } = await axios.post<LinkApiResponse>(
    "/api/link",
    { link: { title, url }, tags },
    {
      headers: {
        Authorization: writeAuth,
      },
    }
  );
  return data;
};

const updateLink = async (
  id: number,
  title: string,
  url: string,
  tags: {
    old: Array<Tag>;
    new: Array<Tag>;
  },
  writeAuth: string
) => {
  const { data } = await axios.put<LinkApiResponse>(
    `/api/link/${id}`,
    { link: { title, url }, tags },
    {
      headers: {
        Authorization: writeAuth,
      },
    }
  );
  return data;
};
