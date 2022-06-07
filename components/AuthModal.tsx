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
import { useContext, useEffect, useState } from "react";
import { Auth, AuthContext } from "../pages";
type AuthModalProps = {
  auth: Auth;
  open: boolean;
  onClose: () => void;
  onUpdate: (newAuth: Auth) => void;
};
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  p: 1,
};

export const AuthModal = ({
  auth,
  onClose,
  onUpdate,
  open,
}: AuthModalProps) => {
  const [read, setRead] = useState("");
  const [write, setWrite] = useState("");

  useEffect(() => {
    setRead(auth.read);
    setWrite(auth.write);
  }, [auth]);

  return (
    <Modal
      open={open}
      onClose={() => {
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
            Set Auth Passwords
          </Typography>
        </Box>
        <Box padding={1}>
          <TextField
            type="password"
            variant="filled"
            style={{ background: "white" }}
            color="secondary"
            fullWidth
            label="Read"
            value={read}
            onChange={(e) => setRead(e.target.value)}
          />
        </Box>
        <Box padding={1}>
          <TextField
            type="password"
            variant="filled"
            style={{ background: "white" }}
            color="secondary"
            fullWidth
            label="Write"
            value={write}
            onChange={(e) => setWrite(e.target.value)}
          />
        </Box>

        <Grid container justifyContent="flex-end" paddingTop={2}>
          <Grid item paddingRight={1}>
            <Button variant="contained" color="warning" onClick={onClose}>
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={() => {
                onUpdate({
                  read,
                  write,
                });
                setRead("");
                setWrite("");
                onClose();
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
