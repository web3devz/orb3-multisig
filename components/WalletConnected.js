import React from "react";
import useBlockChain from "../hooks/useBlockChain";
import { providers, Contract, ethers, utils } from "ethers";
import { Typography, Grid, Link } from "@material-ui/core";

const WalletConnected = () => {
  const { connectedWallet } = useBlockChain();
  console.log(connectedWallet);

  return (
    <div>
      {" "}
      <Grid>
        {connectedWallet ? (
          <>
            <Typography
              variant="body1"
              align="center"
              gutterBottom
              component="div"
            >
              {`Metamask connected account: ${connectedWallet.substring(
                0,
                5
              )}...${connectedWallet.slice(-4)}`}
            </Typography>
            <Typography
              variant="body1"
              align="center"
              gutterBottom
              component="div"
            >
              {" "}
              <Link
                href="https://test.orb3scan.tech/address/0x8F25aEc7A2dc13B74050673347012D13c428dd33?tab=contract"
                variant="body1"
                align="center"
                underline="hover"
                target="_blank"
              >
                Verified Contract on Orb3 ✅
              </Link>
            </Typography>
          </>
        ) : (
          <></>
        )}
      </Grid>
    </div>
  );
};

export default WalletConnected;
