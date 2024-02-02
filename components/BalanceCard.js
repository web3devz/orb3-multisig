import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@material-ui/styles";
import SendIcon from "@mui/icons-material/Send";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AddBalance from "./AddBalance";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const useClasses = makeStyles((theme) => ({
  iconContainer: {
    "&:hover $icon": {
      color: "red",
    },
  },
  icon: {
    color: "blue",
  },
}));

export default function BalanceCard({ balance, receive, owners }) {
  console.log(owners);
  const classes = useClasses();

  return (
    <Box display="flex" justifyContent="center" textAlign="center">
      <Card sx={{ minWidth: 275, mr: 3 }}>
        <CardContent>
          <Typography
            variant="h5"
            // sx={{ fontSize: 14 }}
            color="text.secondary"
            gutterBottom
          >
            Owners
          </Typography>

          {owners?.map((owner, id) => {
            return (
              <Box key={id} sx={{ mb: 1 }}>
                <Typography sx={{ fontSize: 14 }}>
                  {" "}
                  {`${owner.substring(0, 8)}...${owner.slice(-4)}`}{" "}
                  <CopyToClipboard text={owner}>
                    <ContentCopyIcon
                      fontSize="small"
                      sx={{ "&:hover": { color: "blue" } }}
                      cursor="pointer"
                    />
                  </CopyToClipboard>
                </Typography>
              </Box>
            );
          })}
        </CardContent>
      </Card>{" "}
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography
            variant="h5"
            // sx={{ fontSize: 14 }}
            color="text.secondary"
            gutterBottom
          >
            Wallet Balance
          </Typography>
          <Typography variant="h4" component="div">
            {balance} GETH
          </Typography>
        </CardContent>
        <CardActions>
          <AddBalance receive={receive} />
        </CardActions>
      </Card>{" "}
    </Box>
  );
}
