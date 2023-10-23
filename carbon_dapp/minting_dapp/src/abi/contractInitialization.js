// contracts.js

import Web3 from 'web3';

import TOKEN_ABI from './TokenABI';
const tokenContractAddress = "0x12ddCBFC4E120965448609eC9C4B2C0baD2ca953";

// Create and export a function to initialize the token contract
export const tokenContract = async () => {
  try {
    console.log("holaaa")
    const contract =await new web3.eth.Contract(TOKEN_ABI, tokenContractAddress);
    console.log("method: ", contract)
    return contract;
  } catch (error) {
    console.error("Error initializing token contract:", error);
    throw error;
  }
};
