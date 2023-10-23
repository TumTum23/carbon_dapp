import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

function WalletPage() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState(0);
  const [ethToTransfer, setEthToTransfer] = useState(0);
  const [txHash, setTxHash] = useState('');
  const [tokenToTransfer, setTokenToTransfer] = useState(0);
  const [tokenTxHash, setTokenTxHash] = useState('');
  const [tokenToMint, setTokenToMint] = useState(0);
  const [mintTxHash, setMintTxHash] = useState('');

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const loadBlockchainData = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      setWeb3(web3);

      try {
        const [acc] = await web3.eth.requestAccounts();
        setAccount(acc);

        const bal = await web3.eth.getBalance(acc);
        setBalance(web3.utils.fromWei(bal, 'ether'));
      } catch (error) {
        console.error('Error connecting to wallet:', error);
      }
    } else {
      console.log('Please install MetaMask or another Ethereum wallet extension');
    }
  };

  const handleTransferEth = async () => {
    if (web3) {
      try {
        const tx = await web3.eth.sendTransaction({
          to: '0xRecipientAddress',
          value: web3.utils.toWei(ethToTransfer, 'ether'),
        });
        setTxHash(tx.transactionHash);
      } catch (error) {
        console.error('Error transferring ETH:', error);
      }
    }
  };

  const handleTransferToken = async () => {
    // Implement the logic to transfer tokens
  };

  const handleMintToken = async () => {
    // Implement the logic to mint tokens
  };

  return (
    <div className="WalletPage">
      <h1>Connect Wallet</h1>
      <p>Current Balance: {balance} ETH</p>

      <h2>Transfer ETH</h2>
      <input
        type="number"
        value={ethToTransfer}
        onChange={(e) => setEthToTransfer(e.target.value)}
      />
      <button onClick={handleTransferEth}>Transfer ETH</button>
      {txHash && <p>Transaction Hash: {txHash}</p>}

      <h2>Transfer Tokens</h2>
      {/* Implement the UI for transferring tokens here */}
      {tokenTxHash && <p>Token Transaction Hash: {tokenTxHash}</p>}

      <h2>Mint Tokens</h2>
      {/* Implement the UI for minting tokens here */}
      {mintTxHash && <p>Mint Transaction Hash: {mintTxHash}</p>}
    </div>
  );
}

export default WalletPage;
