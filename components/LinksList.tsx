import { Grid, IconButton, styled, Typography } from "@mui/material";
import Link from "next/link";
import { Link as LinkData } from "@prisma/client";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { useState } from "react";
import { LinkModal } from "./LinkModal";
import { format } from "date-fns";
import { colours } from "../src/theme";

type LinksListProps = {
  links: LinkData[];
  updateLinks: (links: LinkData[]) => void;
};

const LinkText = styled(Typography)(() => ({
  color: colours.dark[1],
  transition: "color 0.2s ease-in-out",

  "&:hover": {
    cursor: 'pointer',
    color: colours.light[1],
  },
}));

export const LinksList = ({ links, updateLinks }: LinksListProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkData>();

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
      <Grid
        paddingX={4}
        paddingTop={2}
        container
        flexDirection="column"
        justifyContent="start"
      >
        {links.map((link) => {
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
                    <Link href={link.url}>
                      <LinkText variant="h3">{link.title}</LinkText>
                    </Link>
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
                      await axios.delete(`/api/link/${link.id}`);

                      const newLinks = links.filter((l) => l.id !== link.id);
                      updateLinks(newLinks);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
