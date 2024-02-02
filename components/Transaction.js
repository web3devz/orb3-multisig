import React, { useState, useEffect, useRef } from "react";
import CreateTransaction from "./CreateTransaction";
import RenderTransactions from "./RenderTransactions";
import { providers, Contract, ethers, utils } from "ethers";
import { abi } from "../hooks/utils/MultiSig";
import Web3Modal from "web3modal";
import TransactionList from "./TransactionList";
import {
  Box,
  Chip,
  CircularProgress,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import BalanceCard from "./BalanceCard";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { CopyToClipboard } from "react-copy-to-clipboard";

const Transaction = (props) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [required, setRequired] = useState();
  const [balance, setBalance] = useState();
  const [transactions, setTransactions] = useState([]);
  const [ehash, setEhash] = useState([]);
  const [numApprovers, setNumApprovers] = useState();
  const [txn, setTxn] = useState();

  const web3ModalRef = useRef();

  const createTransaction = async (to, value, data) => {
    try {
      const signer = await getProviderOrSigner(true);
      const walletContract = getWalletContractInstance(signer);
      const txn = await walletContract.submit(
        to,
        utils.parseEther(value.toString()),
        data
      );
      setLoading(true);
      await txn.wait();
      setLoading(false);
      await getNumTransactionsinWallet();
    } catch (error) {
      console.error(error);
      alert(error.data ? error.data.message : error.message);
    }
  };

  const approveTransaction = async (_txId) => {
    try {
      const signer = await getProviderOrSigner(true);
      const walletContract = getWalletContractInstance(signer);
      const txn = await walletContract.approve(_txId);
      setLoading(true);
      await txn.wait();
      setLoading(false);
      await getNumTransactionsinWallet();
    } catch (error) {
      console.error(error);
      window.alert(error.data.message);
    }
  };

  const revokeTransaction = async (_txId) => {
    try {
      const signer = await getProviderOrSigner(true);
      const walletContract = getWalletContractInstance(signer);
      const txn = await walletContract.revoke(_txId);
      setLoading(true);
      await txn.wait();
      setLoading(false);
      await getNumTransactionsinWallet();
    } catch (error) {
      console.error(error);
      window.alert(error.data.message);
    }
  };

  const [owners, setOwners] = useState([]);

  const getOwners = async () => {
    try {
      const signer = await getProviderOrSigner();
      const walletContract = getWalletContractInstance(signer);
      if (walletContract) {
        const txn = await walletContract.returnAllOwners();
        await setOwners(txn);
        console.log(txn);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getNumApprovers = async (txId) => {
    try {
      const signer = await getProviderOrSigner();
      const walletContract = getWalletContractInstance(signer);
      const txn = await walletContract.getApprovalCount(txId);
      return txn;
    } catch (error) {
      console.error(error);
    }
  };

  const getRequired = async (txId) => {
    try {
      const signer = await getProviderOrSigner();
      const walletContract = getWalletContractInstance(signer);
      if (walletContract) {
        const txn = await walletContract.required();
        setRequired(txn.toNumber());
      }
    } catch (error) {
      console.error(error.message);
      window.alert(error.message);
    }
  };

  const getBalance = async () => {
    try {
      const signer = await getProviderOrSigner();
      const walletContract = getWalletContractInstance(signer);
      if (walletContract) {
        const txn = await walletContract.getBalance();
        setBalance(ethers.utils.formatEther(txn.toString()));
        console.log(txn.toString());
      }
    } catch (error) {
      console.error(error.message);
      window.alert(error.message);
    }
  };

  const checkIfApproved = async (txId) => {
    try {
      const signer = await getProviderOrSigner();
      const walletContract = getWalletContractInstance(signer);
      if (walletContract) {
        // const address = await signer.getAddress();
        const accounts = await window.ethereum.enable();
        const txn = await walletContract.checkIfApproved(txId, accounts[0]);

        console.log(txn);
        return txn;
      }
    } catch (error) {
      console.error(error);
      window.alert(error);
    }
  };

  const executeTransaction = async (_txId) => {
    try {
      const signer = await getProviderOrSigner(true);
      const walletContract = getWalletContractInstance(signer);
      const txn = await walletContract.execute(_txId);
      setLoading(true);
      await txn.wait();
      setLoading(false);
      setTxn({ hash: txn.hash, from: txn.from, to: txn.to });
      console.log(txn);
      await getNumTransactionsinWallet();
    } catch (error) {
      console.error(error);
      window.alert(error.data ? error.data.message : error.message);
    }
  };

  const [rhash, setRhash] = useState();

  const receive = async (value) => {
    try {
      const signer = await getProviderOrSigner(true);
      const addr = signer.getAddress();
      const transaction = await signer.sendTransaction({
        from: addr,
        to: props.contractAddress,
        value: value,
      });
      setLoading(true);
      await transaction.wait();
      setRhash(transaction);
      setLoading(false);
      if (transaction.from) {
        getBalance();
        console.log(rhash);
      }
      console.log(transaction);
    } catch (error) {
      console.error(error);
      alert(error.data.message);
    }
  };

  const fetchTransactionById = async (id) => {
    try {
      const provider = await getProviderOrSigner();
      const walletContract = getWalletContractInstance(provider);
      const transaction = await walletContract.transactions(id);
      const approved = await checkIfApproved(id);
      const numApprovers = await getNumApprovers(id);
      const parsedTransaction = {
        transactionId: id,
        to: transaction.to.toString(),
        value: transaction.value.toString(),
        data: transaction.data.toString(),
        executed: transaction.executed,
        numApprovers: numApprovers,
        approved: approved,
      };

      return parsedTransaction;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllTransactions = async (n) => {
    try {
      const provider = await getProviderOrSigner();
      const walletContract = getWalletContractInstance(provider);
      const transactions = [];
      for (let i = 0; i < n; i++) {
        const transaction = await fetchTransactionById(i);
        transactions.push(transaction);
        console.log(transaction);
      }
      setTransactions(transactions);

      console.log(transactions);
    } catch (error) {
      console.error(error);
    }
  };

  const getNumTransactionsinWallet = async () => {
    try {
      const provider = await getProviderOrSigner();
      const walletContract = getWalletContractInstance(provider);

      if (walletContract) {
        const txn = await walletContract.numTransactions();
        fetchAllTransactions(txn.toNumber());
        getBalance();
        return txn;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getWalletContractInstance = (providerOrSigner) => {
    if (walletConnected) {
      return new Contract(props.contractAddress, abi, providerOrSigner);
    }
  };

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 1627454953838939) {
      window.alert("Change the network to Orb3 Network");
      throw new Error("Change network to Orb3 Network");
    }
    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
      if (walletConnected) {
        await getNumTransactionsinWallet();
        await getRequired();
        await getOwners();
        await getBalance();
        await getConnectedWallet();
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "Orb3",
        providerOptions: {},
        disableInjectedProvider: false,
      });
    }
    connectWallet();
    changeConnectedWallet();
  }, [walletConnected]);

  const noData = () => {
    return <Typography align="center">No Transactions to Display</Typography>;
  };

  const handleClick = () => {
    window.open(
      `https://test.orb3scan.tech/address/${props.contractAddress}`
    );
  };

  const [connectedWallet, setConnectedWallet] = useState();

  const getConnectedWallet = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      if (signer) {
        const addr = await signer.getAddress();
        setConnectedWallet(addr);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const changeConnectedWallet = async () => {
    try {
      window.ethereum.on("accountsChanged", function (accounts) {
        connectWallet();
        getConnectedWallet();
      });
    } catch (err) {
      console.log("Oops, `window` is not defined");
    }
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {connectedWallet ? (
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
          ) : (
            <></>
          )}
          <Box textAlign="center" justifyContent="center" justify="center">
            <>
              <Typography
                variant="h6"
                align="center"
                gutterBottom
                component="div"
              >
                MultiSig Wallet Contract Address
              </Typography>
              <CopyToClipboard text={props.contractAddress}>
                <Chip
                  label={props.contractAddress}
                  variant="outlined"
                  sx={{ mb: 1 }}
                  icon={<ContentCopyIcon />}
                  style={{
                    width: "30em",
                    height: "3em",
                  }}
                />
              </CopyToClipboard>
              <Grid sx={{ mb: 3 }}>
                <Link
                  href={`https://test.orb3scan.tech/address/${props.contractAddress}`}
                  underline="hover"
                  target="_blank"
                >
                  View Contract On Orb3 Explorer
                </Link>
              </Grid>
            </>
          </Box>

          <Box sx={{ mb: 5 }}>
            <BalanceCard balance={balance} receive={receive} owners={owners} />
          </Box>
          <Box sx={{ mb: 3 }}>
            <CreateTransaction
              createTransaction={createTransaction}
              loading={loading}
            />
          </Box>
          <Typography variant="h6" align="center" gutterBottom component="div">
            Transaction Logs{" "}
          </Typography>
          <RenderTransactions transactions={transactions} />

          {!transactions.length ? (
            noData()
          ) : (
            <TransactionList
              transactions={transactions}
              walletConnected={walletConnected}
              approveTransaction={approveTransaction}
              executeTransaction={executeTransaction}
              revokeTransaction={revokeTransaction}
              loading={loading}
              numApprovers={numApprovers}
              required={required}
              getNumApprovers={getNumApprovers}
              checkIfApproved={checkIfApproved}
              txn={txn}
            />
          )}
        </>
      )}
    </Grid>
  );
};

export default Transaction;
