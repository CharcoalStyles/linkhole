import { Box, Grid, IconButton, TextField, Typography } from "@mui/material";
import { Link } from "@prisma/client";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { LinkModal } from "./LinkModal";
import { format } from "date-fns";
import { colours } from "../src/theme";
import styled from "@emotion/styled";
import { AuthContext } from "../pages";

type LinksListProps = {
  links: Link[];
  updateLinks: (links: Link[]) => void;
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
  const { write } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editingLink, setEditingLink] = useState<Link>();

  const [search, setSearch] = useState<string>("");
  const [filteredLinks, setFilteredLinks] = useState<Link[]>(links);

  useEffect(() => {
    if (search !== "") {
      setFilteredLinks(
        links.filter(
          (link) =>
            link.title.toLowerCase().includes(search.toLowerCase()) ||
            link.url.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFilteredLinks(links);
    }
  }, [search, links]);

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
      <Grid
        paddingX={4}
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
                      <Typography variant="h3">{link.title}</Typography>
                    </LinkText>
                    <Grid item>
                      <Typography variant="body1">{link.url}</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="body2">
                        {format(
                          new Date(link.createdAt),
                          "yyyy-MM-dd HH:mm:ss(xxx)"
                        )}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item>
                  {canWrite && (
                    <>
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
                    </>
                  )}
                </Grid>
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
