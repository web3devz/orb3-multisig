import { CircularProgress, Link, Div, Typography, Button } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState, useEffect } from "react";
import useBlockChain from "../hooks/useBlockChain";
import DeployWalletForm from "../components/DeployWalletForm";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';


const Form = () => {
  const {
    walletConnected,
    loading,
    getProviderOrSigner,
    connectWallet,
    createNewMultiSig,
    returnWallet,
    address,
    txn,
  } = useBlockChain();

  // console.log(address);

  const addresses = [];

  const host = process.env.url;

  const transaction = {
    hash: txn.hash,
    from: txn.from,
    to: txn.to,
    url: `https://test.orb3scan.tech/tx/${txn.hash}`,
    walleturl: `${host}/wallet/${address}`,
    walletexplorer: `https://test.orb3scan.tech/address/${address}`,
  };

  console.log(host);

  const RenderWallet = () => {
    return (
      <>
        <Box sx={{ m: 5 }} textAlign="center">
          <Link
            href={transaction.url}
            target="_blank"
            variant="h6"
            rel="noopener noreferrer"
            underline="always"
          >
            View Transaction on Orb3 Explorer
          </Link>
        </Box>
        <Box sx={{ m: 5 }} textAlign="center">
          <Typography variant="h5" gutterBottom component="div" sx={{ mb: 5 }}>
            Wallet Contract Successfully Deployed to {address} 🥳🥳
          </Typography>
        </Box>
        <Box sx={{ m: 2 }} textAlign="center">
          <Link
            href={transaction.walleturl}
            variant="h5"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ mb: 2 }}
            underline="always"
          >
            <Button
              variant="contained"
              size="large"
              endIcon={<RocketLaunchIcon />}
            >
              Get Started
            </Button>
          </Link>
<br></br>
          <br></br>
          <Button
              variant="contained"
              size="large"
              onClick={() => {navigator.clipboard.writeText(transaction.walleturl)}}
              endIcon={<ContentCopyRoundedIcon />}
            >
Copy & Save        </Button>
        </Box>
      </>
    );
  };

  return (
    <Box>
      {!address ? (
        !loading ? (
          <DeployWalletForm
            createNewMultiSig={createNewMultiSig}
            returnWallet={returnWallet}
          />
        ) : (
          <Box>
            <CircularProgress />
          </Box>
        )
      ) : (
        <RenderWallet />
      )}
    </Box>
  );
};

export default Form;
