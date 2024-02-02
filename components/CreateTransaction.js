import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  TextField,
  Box,
  CircularProgress,
} from "@mui/material";
import React, { useState, useEffect } from "react";

const CreateTransaction = (props) => {
  const [open, setOpen] = React.useState(false);

  const [to, setTo] = useState("");
  const [value, setValue] = useState(0);
  const [data, setData] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const submitTransaction = async (e) => {
    e.preventDefault();
    console.log(to, value, data);
    await props.createTransaction(to, value, data);
    console.log(props.loading);
    setTo("");
    setValue(0);
    setData("");
    if (props.loading) {
      setOpen(true);
    }
    setOpen(false);
  };

  return (
    <div>
      <Box textAlign="center">
        <Button variant="contained" onClick={handleClickOpen} size="large">
          Create New Transaction
        </Button>
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create a New Transaction</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter recipient metmask address, value(GETH) and data(bytes)
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="to"
            name="to"
            label="Send To (Address)"
            type="to"
            onChange={(e) => setTo(e.target.value)}
            fullWidth
            variant="outlined"
          />
          <TextField
            autoFocus
            margin="dense"
            id="value"
            name="value"
            label="Value (GETH)"
            type="number"
            onChange={(e) => setValue(e.target.value)}
            fullWidth
            variant="outlined"
          />
          <TextField
            autoFocus
            margin="dense"
            id="data"
            name="data"
            label="Data (bytes)"
            type="data"
            onChange={(e) => setData(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={submitTransaction}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateTransaction;
