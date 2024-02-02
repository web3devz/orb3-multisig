import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { utils } from "ethers";
import { Box } from "@mui/material";

export default function AddBalance({ receive }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deposit = () => {
    receive(value);
    setOpen(false);
  };

  const handleChange = (e) => {
    setValue(utils.parseEther(e.target.value.toString()));
  };

  return (
    <div>
      <Box sx={{ mx: "auto", width: 300, mb: 3 }}>
        <Button
          size="large"
          variant="contained"
          onClick={handleClickOpen}
          endIcon={<AccountBalanceWalletIcon />}
        >
          Deposit
        </Button>
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Funds </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the amount you to deposit to Multisig Wallet.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="amount"
            label="Amount (GETH)"
            type="number"
            fullWidth
            onChange={handleChange}
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={deposit}>Deposit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
