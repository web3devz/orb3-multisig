import React, { useEffect, useState, useRef } from "react";
import { abi } from "./utils/MultiSig";
import { providers, Contract } from "ethers";
import Web3Modal from "web3modal";

const contractAddress = "0x8F25aEc7A2dc13B74050673347012D13c428dd33";

const useMultiSigWallet = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [numApprovers, setNumApprovers] = useState(0);
  const [numtxs, setNumtxs] = React.useState("Hi");

  const web3ModalRef = useRef();

  const createTransaction = async (to, value, data) => {
    try {
      const signer = await getProviderOrSigner(true);
      const walletContract = getWalletContractInstance(signer);
      const txn = await walletContract.submit(to, value, data);
      setLoading(true);
      await txn.wait();
      await getApprovalCount();
      setLoading(false);
      await getNumTransactionsinWallet();
    } catch (error) {
      console.error(error);
      window.alert(error);
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
    } catch (error) {
      console.error(error);
      window.alert(error);
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
    } catch (error) {
      console.error(error);
      window.alert(error);
    }
  };

  const fetchTransactionById = async (id) => {
    try {
      const provider = await getProviderOrSigner();
      const walletContract = getWalletContractInstance(provider);
      const transaction = await walletContract.transactions(id);
      const parsedTransaction = {
        transactionId: id,
        to: transaction.to.toString(),
        value: transaction.value.toString(),
        data: transaction.data.toString(),
        executed: transaction.executed,
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
      }
      setTransactions(transactions);
      console.log(transactions);
    } catch (error) {
      console.error(error);
    }
  };

  const getApprovalCount = async (txId) => {
    try {
      const signer = await getProviderOrSigner();
      const walletContract = getWalletContractInstance(signer);
      const txn = await walletContract._getApprovalCount(txId);
      setNumApprovers(txn);
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
      console.log(txn);
    } catch (error) {
      console.error(error);
      window.alert(error.data.message);
    }
  };

  const getNumTransactionsinWallet = async () => {
    try {
      const provider = await getProviderOrSigner();
      const walletContract = getWalletContractInstance(provider);
      const txn = await walletContract.numTransactions();
      fetchAllTransactions(txn.toNumber());
    } catch (error) {
      console.error(error);
    }
  };

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 1627454953838939) {
      window.alert("Change the network to Orb3 Testnet");
      throw new Error("Change network to Orb3 Testnet");
    }
    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  const getWalletContractInstance = (providerOrSigner) => {
    // console.log(p.contractAddress);
    return new Contract(contractAddress, abi, providerOrSigner);
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
      setNumtxs("Hello");
      console.log(walletConnected);
      // await getNumTransactionsinWallet();
    } catch (err) {
      console.error(err);
    }
  };

  const setContractAddress = (p) => {
    let address = p;
    console.log(address);
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "Orb3",
        providerOptions: {},
        disableInjectedProvider: false,
      });
    }
    // connectWallet();
  }, [walletConnected]);

  return {
    walletConnected,
    loading,
    getProviderOrSigner,
    connectWallet,
    createTransaction,
    revokeTransaction,
    approveTransaction,
    executeTransaction,
    getApprovalCount,
    transactions,
    getWalletContractInstance,
    getProviderOrSigner,
    numtxs,
    connectWallet,
    setContractAddress,
  };
};

export default useMultiSigWallet;
