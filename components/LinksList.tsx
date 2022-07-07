import {
  Box,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { LinkModal } from "./LinkModal";
import { format } from "date-fns";
import { colours } from "../src/theme";
import styled from "@emotion/styled";
import { AuthContext, fetcher } from "../pages";
import { LinkApiResponse } from "../src/apiTypes";
import { TagChip } from "./TagChip";
import useSWR from "swr";
import { Tag } from "@prisma/client";

type LinksListProps = {
  links: LinkApiResponse[];
  updateLinks: (links: LinkApiResponse[]) => void;
  canWrite: boolean;
};

const LinkText = styled.a(() => ({
  color: colours.dark[1],
  transition: "color 0.2s ease-in-out",
  textDecorationColor: colours.dark[1],

  "&:visited": {
    textDecorationColor: colours.dark[1],
  },

  "&:hover": {
    cursor: "pointer",
    color: colours.light[1],
  },
}));

export const LinksList = ({ canWrite, links, updateLinks }: LinksListProps) => {
  const { write, read } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkApiResponse>();

  const [search, setSearch] = useState<string>("");
  const [filterTags, setFilterTags] = useState<Tag[]>([]);
  const [filteredLinks, setFilteredLinks] = useState<LinkApiResponse[]>(links);

  const { data } = useSWR<Tag[]>(["/api/tag", read], fetcher);

  useEffect(() => {
    let updatedLinks = [...links];
    if (search !== "") {
      updatedLinks = updatedLinks.filter(
        (link) =>
          link.title.toLowerCase().includes(search.toLowerCase()) ||
          link.url.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filterTags.length > 0) {
      updatedLinks = updatedLinks.filter((link) =>
        filterTags.every((ft) => link.tags.some(({ tag }) => tag.id === ft.id))
      );
    }
    setFilteredLinks(updatedLinks);
  }, [search, filterTags, links]);

  return (
    <>
      <LinkModal
        link={editingLink}
        open={isEditing}
        onClose={() => setIsEditing(false)}
        onUpdate={(link) => {
          setIsEditing(false);
          updateLinks(links.map((l) => (l.id === link.id ? link : l)));
        }}
      />
      <Box paddingY={2} paddingX={4}>
        <TextField
          fullWidth
          label="Search"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>
      {data && (
        <Box maxWidth="100%" overflow="auto" paddingX={4}>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {data.map((tag) => {
              const selected = filterTags.includes(tag);
              return (
                <TagChip
                  key={tag.id}
                  tag={tag}
                  onClick={() => {
                    setFilterTags((original) => {
                      if (selected) {
                        return original.filter((t) => t.id !== tag.id);
                      } else {
                        return [...original, tag];
                      }
                    });
                  }}
                  color={selected ? "primary" : "default"}
                  variant={selected ? "filled" : "outlined"}
                />
              );
            })}
          </Stack>
        </Box>
      )}
      <Grid
        sx={{
          paddingX: {
            xs: 0,
            sm: 4,
          },
        }}
        paddingTop={2}
        container
        flexDirection="column"
        justifyContent="start"
      >
        {filteredLinks.map((link) => {
          return (
            <Grid item key={link.id} borderBottom={2} paddingBottom={1}>
              <Grid
                container
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid item>
                  <Grid container flexDirection="column">
                    <LinkText href={link.url} target="_blank">
                      <Typography
                        variant="h3"
                        sx={{
                          fontSize: {
                            xs: "1.5rem",
                            sm: "3rem",
                          },
                        }}
                      >
                        {link.title}
                      </Typography>
                    </LinkText>
                    <Grid item>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: {
                            xs: "0.75rem",
                            sm: "0.95rem",
                          },
                        }}
                      >
                        {link.url}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="body2">
                        {format(
                          link.createdAt
                            ? new Date(link.createdAt)
                            : new Date(),
                          "yyyy-MM-dd HH:mm:ss(xxx)"
                        )}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item>
                  <Stack flexDirection="column" alignItems="end">
                    {canWrite && (
                      <Box>
                        <IconButton
                          size="large"
                          onClick={() => {
                            setEditingLink(link);
                            setIsEditing(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="large"
                          color="error"
                          aria-label="delete"
                          onClick={async () => {
                            await axios.delete(`/api/link/${link.id}`, {
                              headers: {
                                Authorization: write,
                              },
                            });

                            const newLinks = links.filter(
                              (l) => l.id !== link.id
                            );
                            updateLinks(newLinks);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    )}

                    <Stack paddingY={1} direction="row" spacing={1}>
                      {link.tags.map(({ tag }) => (
                        <TagChip
                          key={tag.id}
                          tag={tag}
                          color="primary"
                          variant="filled"
                        />
                      ))}
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
