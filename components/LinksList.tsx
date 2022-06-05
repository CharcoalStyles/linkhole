import { Grid, IconButton, Typography } from "@mui/material";
import Link from "next/link";
import { Link as LinkData } from "@prisma/client";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { useState } from "react";
import { LinkModal } from "./LinkModal";

type LinksListProps = {
  links: LinkData[];
  updateLinks: (links: LinkData[]) => void;
};

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
              <Grid container flexDirection="row" alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Link href={link.url}>
                    <Typography variant="h3">{link.title}</Typography>
                  </Link>
                  <Grid container>
                    <Grid item>
                      <Typography variant="body1">{link.url}</Typography>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item>
                  <IconButton size="large" onClick={() => {
                    setEditingLink(link);
                    setIsEditing(true);
                  }}>
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
