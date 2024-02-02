import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SendIcon from "@mui/icons-material/Send";
import IconButton from "@mui/material/IconButton";
import CommentIcon from "@mui/icons-material/Comment";
import { Box, Button, Typography } from "@mui/material";
import { providers, Contract, ethers, utils } from "ethers";
import { useState } from "react";

const TransactionList = ({
  transactions,
  walletConnected,
  approveTransaction,
  executeTransaction,
  revokeTransaction,
  loading,
  numApprovers,
  required,
  getNumApprovers,
  checkIfApproved,
}) => {

  const handleToggle = (value) => () => {
    const currentIndex = approveTransaction(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <Box
      //   sx={{ width: "75%" }}
      display="flex"
      justifyContent="center"
      alignItems="center"
      //   minHeight="100vh"
    >
      <List
        sx={{ width: "100%", maxWidth: 900, bgcolor: "background.paper" }}
        edge="center"
      >
        {transactions?.map((transaction) => {
          console.log(transaction);
          return (
            <Box key={transaction.transactionId} sx={{ mb: 3, boxShadow: 2 }}>
              <ListItem>
                <ListItemText
                  primary={utils.formatEther(transaction.value) + " GETH"}
                  sx={{ mr: 2 }}
                />
                <ListItemIcon>
                  <SendIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={transaction.to}
                  sx={{ width: 400, mr: 2 }}
                />

                {walletConnected ? (
                  transaction.numApprovers >= required ? (
                    transaction.executed ? (
                      <>
                        <Typography variant="body1" gutterBottom>
                          <a href="#">Executed</a>
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Button
                          sx={{ mr: 2 }}
                          variant="contained"
                          onClick={() => {
                            executeTransaction(transaction.transactionId);
                          }}
                        >
                          Execute
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => {
                            revokeTransaction(transaction.transactionId);
                          }}
                        >
                          Revoke
                        </Button>
                      </>
                    )
                  ) : !transaction.approved ? (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => {
                          approveTransaction(transaction.transactionId);
                        }}
                      >
                        Approve
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => {
                        revokeTransaction(transaction.transactionId);
                      }}
                    >
                      Revoke
                    </Button>
                  )
                ) : (
                  <Button
                    onClick={() => {
                      connectWallet();
                    }}
                  >
                    Connect Your Wallet
                  </Button>
                )}
              </ListItem>
            </Box>
          );
        })}
      </List>
    </Box>
  );
};

export default TransactionList;
