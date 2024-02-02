import React, { useEffect, useState, useRef } from "react";
import { abi } from "./utils/MultiSigFactory";
import { providers, Contract } from "ethers";
import Web3Modal from "web3modal";

const contractAddress = "0x8F25aEc7A2dc13B74050673347012D13c428dd33";

const useBlockChain = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const web3ModalRef = useRef();
  const [address, setAddress] = useState();
  const [txn, setTxn] = useState("");

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

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      await getConnectedWallet();
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  const createNewMultiSig = async (accounts, required, timelock) => {
    try {
      const signer = await getProviderOrSigner(true);
      const DeployMultiSig = new Contract(contractAddress, abi, signer);
      const tx = await DeployMultiSig.createNewMultiSig(
        accounts,
        required,
        timelock
      );
      setLoading(true);
      await tx.wait();
      setLoading(false);
      setTxn({ hash: tx.hash, from: tx.from, to: tx.to });
      await returnWallet();
    } catch (err) {
      console.log(err);
      alert(err.data ? err.data.message : err.message);
    }
  };

  let length;
  const returnWallet = async () => {
    try {
      const provider = await getProviderOrSigner();
      const DeployMultiSig = new Contract(contractAddress, abi, provider);
      const tx = await DeployMultiSig.returnAllWallets();
      length = tx.length;
      console.log(length);
      if (walletConnected) {
        setAddress(tx[length - 1]);
      }
    } catch (err) {
      console.error(err);
    }
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

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "Orb3",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
      changeConnectedWallet();
    }
  }, [walletConnected]);

  return {
    walletConnected,
    loading,
    getProviderOrSigner,
    connectWallet,
    createNewMultiSig,
    returnWallet,
    address,
    txn,
    connectedWallet,
  };
};

export default useBlockChain;
