export const abi = [
  {
    inputs: [
      {
        internalType: "address[]",
        name: "addresses",
        type: "address[]",
      },
      {
        internalType: "uint256",
        name: "_required",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_timelock",
        type: "uint256",
      },
    ],
    name: "createNewMultiSig",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "deployedMultiSig",
    outputs: [
      {
        internalType: "contract MultiSigWallet",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "returnAllWallets",
    outputs: [
      {
        internalType: "contract MultiSigWallet[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
