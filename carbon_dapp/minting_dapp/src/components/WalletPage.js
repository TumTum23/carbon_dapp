import TOKEN_ABI from '../abi/TokenABI';
import detectEthereumProvider from '@metamask/detect-provider';
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import("./WalletPage.css");


function WalletPage() {
  let [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState(0);
  const [ethToTransfer, setEthToTransfer] = useState(0);
  const [txHash, setTxHash] = useState("");
  const [tokenToTransfer, setTokenToTransfer] = useState(0);
  const [tokenTxHash, setTokenTxHash] = useState("");
  const [tokenToMint, setTokenToMint] = useState(0);
  const [mintTxHash, setMintTxHash] = useState("");

  const tokenContractAddress = "0x916482b5324d4F782c996503e54c206FA41638C3";
  const [tokenContractInstance, setTokenContractInstance] = useState(null);

  let provider
//   let web3;

     // Initialise Contracts
    useEffect(() => {
      async function initializeContracts() {
        try {
          const web3 = new Web3(window.ethereum); // Assuming MetaMask is available
          const tokenContract = new web3.eth.Contract(TOKEN_ABI, tokenContractAddress);
          setTokenContractInstance(tokenContract);

        } catch (error) {
          console.error("Error initializing contracts:", error);
        }
      }

      initializeContracts();
    }, []);

	const getProvider = async() =>{
		provider =  await detectEthereumProvider();
		web3 = new Web3(provider);
		if (provider) {
			console.log('Ethereum successfully detected!')
		} else {   
			console.log('Please install MetaMask!')
		}
	  }
  
		useEffect(() => {
		  getProvider();
	  });
  useEffect(() => {
    connectWallet();
  }, []);

  
//   const connectWallet = async () => {
//     if (window.ethereum) {
//       try {
//         const web3 = new Web3(window.ethereum);
//         await window.ethereum.enable(); // Request user's permission to access their accounts
//         setWeb3(web3);

//         const [acc] = await web3.eth.getAccounts();
//         setAccount(acc);

//         const bal = await web3.eth.getBalance(acc);
//         setBalance(parseFloat(web3.utils.fromWei(bal, 'ether')).toFixed(2));
//       } catch (error) {
//         // console.error('Error connecting to wallet:', error);
//         // toast.error('Error connecting to wallet', {
//         //   position: toast.POSITION.TOP_CENTER,
//         // });
//       }
//     } else {
//       console.log('Please install MetaMask or another Ethereum wallet extension');
//       toast.error('Please install MetaMask or another Ethereum wallet extension', {
//         position: toast.POSITION.TOP_CENTER,
//       });
//     }
//   };

const connectWallet = async () => {
	if (window.ethereum) {
	  try {
		const web3 = new Web3(window.ethereum);
		setWeb3(web3);
  
		if (window.ethereum.isMetaMask) {
		  const accounts = await window.ethereum.request({
			method: 'eth_requestAccounts',
		  });
  
		  if (accounts.length > 0) {
			const acc = accounts[0];
			setAccount(acc);
  
			const bal = await web3.eth.getBalance(acc);
			setBalance(parseFloat(web3.utils.fromWei(bal, 'ether')).toFixed(4));
		  } else {
			console.log('User refused to connect a wallet.');
			toast.error('You refused to connect a wallet.', {
			  position: toast.POSITION.TOP_CENTER,
			});
			setBalance('0.0000'); // Set the balance to 0.0000 or any format you prefer
		  }
		} else {
		  console.log('Please install MetaMask or another Ethereum wallet extension');
		  toast.error('Please install MetaMask or another Ethereum wallet extension', {
			position: toast.POSITION.TOP_CENTER,
		  });
		}
	  } catch (error) {
		// console.error('Error connecting to wallet:', error);
		toast.error('Error connecting to wallet', {
		  position: toast.POSITION.TOP_CENTER,
		});
	  }
	} else {
	  console.log('Please install MetaMask or another Ethereum wallet extension');
	  toast.error('Please install MetaMask or another Ethereum wallet extension', {
		position: toast.POSITION.TOP_CENTER,
	  });
	}
  };

  
  const handleTransferEth = async () => {
    if (web3) {
      const recipientAddress = document.getElementById(
        "ethRecipientAddress"
      ).value;
      const ethToTransferValue = parseFloat(ethToTransfer);

      if (!recipientAddress) {
        toast.error("Recipient address is required!", {
          position: toast.POSITION.TOP_CENTER,
        });
        return;
      }

      if (isNaN(ethToTransferValue) || ethToTransferValue <= 0) {
        toast.error("Invalid amount. Please enter a valid positive number.", {
          position: toast.POSITION.TOP_CENTER,
        });
        return;
      }

      if (ethToTransferValue > parseFloat(balance)) {
        toast.error("Insufficient balance for the transfer.", {
          position: toast.POSITION.TOP_CENTER,
        });
        return;
      }

      try {

		toast.success("ETH transfer in process!", {
			position: toast.POSITION.TOP_CENTER,
		  });
	
        const tx = await web3.eth.sendTransaction({
          to: recipientAddress,
          value: web3.utils.toWei(ethToTransfer, "ether"),
          from: account,
        });

        setTxHash(tx.transactionHash);
        toast.success("ETH transfer Success!", {
          position: toast.POSITION.TOP_CENTER,
        });
      } catch (error) {
        console.error("Error transferring ETH:", error);
        toast.error("ETH transfer failed!", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    }
  };
  const handleTransferToken = async () => {
	try {
	  console.log(provider);
  
	  const recipientAddress = document.getElementById("tokenRecipientAddress").value;
	  const tokenToTransferValue = parseFloat(tokenToTransfer);
  
	  if (tokenToTransferValue <= 0) {
		toast.error("Token transfer value must be greater than 0", {
		  position: toast.POSITION.TOP_CENTER,
		});
		return;
	  }
  
	  if (!recipientAddress) {
		toast.error("Recipient address cannot be empty", {
		  position: toast.POSITION.TOP_CENTER,
		});
		return;
	  }
  
	  // Check if the balance of tokens is sufficient for the transfer
	  const tokenBalance = await tokenContractInstance.methods.balanceOf(account).call();
	  const value = web3.utils.toWei(tokenToTransferValue.toString(), 'ether');
	  if (parseInt(tokenBalance) < parseInt(value)) {
		toast.error("Insufficient token balance for the transfer", {
		  position: toast.POSITION.TOP_CENTER,
		});
		return;
	  }
  
	  const tx = tokenContractInstance.methods.transfer(recipientAddress, value);
	  var gas = await tx.estimateGas({ from: account });
	  console.log(account);
	  const data = tx.encodeABI();
	  console.log("Gas: ", gas);
  
	  toast.success("Token transfer in process!", {
		position: toast.POSITION.TOP_CENTER,
	  });
	  
	  const transactionHash = await provider.request({
		method: 'eth_sendTransaction',
		params: [
		  {
			gas: web3.utils.toHex(gas),
			to: tokenContractAddress,
			from: account,
			value: '0x0',
			data: data,
		  },
		],
	  });
  
	  // Handle the result
	  console.log(transactionHash);
	  setTokenTxHash(transactionHash);
	  toast.success("Token transfer success!", {
		position: toast.POSITION.TOP_CENTER,
	  });
	} catch (error) {
	  console.error(error);
	  toast.error("Error transferring tokens", {
		position: toast.POSITION.TOP_CENTER,
	  });
	}
  };
  
  const handleMintToken = async () => {
	try {
	  const recipientAddress = document.getElementById("mintRecipientAddress").value;
	  const tokenToMintValue = web3.utils.toWei(tokenToMint.toString(), 'ether')
  
	  if (tokenToMintValue <= 0) {
		toast.error("Token mint value must be greater than 0", {
		  position: toast.POSITION.TOP_CENTER,
		});
		return;
	  }
  
	  if (!recipientAddress) {
		toast.error("Recipient address cannot be empty", {
		  position: toast.POSITION.TOP_CENTER,
		});
		return;
	  }
  
	  // Attempt to mint tokens
	  try {
		const tx = tokenContractInstance.methods.mint(recipientAddress, tokenToMintValue);
		var gas = await tx.estimateGas({ from: account });
		const data = tx.encodeABI();
  
		const transactionParameters = {
		  gas: web3.utils.toHex(gas),
		  to: tokenContractAddress,
		  from: account,
		  value: '0x0',
		  data: data,
		};
  
		toast.success("Token minting in process!", {
			position: toast.POSITION.TOP_CENTER,
		  });

		const transactionHash = await provider.request({
		  method: 'eth_sendTransaction',
		  params: [transactionParameters],
		});

		
		// Set the transaction hash in the state
		setMintTxHash(transactionHash);
  
		toast.success("Token Minting success!", {
		  position: toast.POSITION.TOP_CENTER,
		});
	  } catch (error) {
		if (error.message.includes("must have minter role to mint")) {
		  toast.error("You do not have the minter role to mint tokens", {
			position: toast.POSITION.TOP_CENTER,
		  });
		} else if (error.message.includes("reverted: ERC20Capped: cap exceeded")) {
		  toast.error("Capped supply exceeded. Minting is not allowed.", {
			position: toast.POSITION.TOP_CENTER,
		  });
		} else {
		  console.error(error);
		  toast.error("Error minting tokens", {
			position: toast.POSITION.TOP_CENTER,
		  });
		}
	  }
	} catch (error) {
	  console.error(error);
	  toast.error("Error minting tokens", {
		position: toast.POSITION.TOP_CENTER,
	  });
	}
  };
  

  return (
    <div className="wallet-container">
      <button className="connect-wallet-button" onClick={connectWallet}>Connect Wallet</button>
      <div className="wallet-header">
        <h1>Balance: {balance} ETH</h1>
      </div>

      <div className="mint-section">
        <h2>Mint ERC20 Token</h2>
        <div className="input-section">
          <input type="text" placeholder="Recipient Address" id="mintRecipientAddress"/>
          <input
            type="number"
            value={tokenToMint}
            onChange={(e) => setTokenToMint(e.target.value)}
            placeholder="Enter Token amount"
          />
          <button onClick={handleMintToken}>Mint</button>
        </div>
        {mintTxHash && (
          <p className="tx-hash">Transaction Hash: {mintTxHash}</p>
        )}
      </div>

      <div className="transfer-section">
        <div className="eth-section">
          <h2>Send ETH</h2>
          <div className="input-section">
            <input
              type="text"
              placeholder="Recipient Address"
              id="ethRecipientAddress"
            />
            <input
              type="number"
              value={ethToTransfer}
              onChange={(e) => setEthToTransfer(e.target.value)}
              placeholder="Enter ETH amount"
            />
            <button onClick={handleTransferEth}>Send ETH</button>
          </div>
          {txHash && <p className="tx-hash">Transaction Hash: {txHash}</p>}
        </div>

        <div className="token-section">
          <h2>Send Token</h2>
          <div className="input-section">
            <input type="text" placeholder="Recipient Address" id="tokenRecipientAddress" />
            <input
              type="number"
              value={tokenToTransfer}
              onChange={(e) => setTokenToTransfer(e.target.value)}
              placeholder="Enter Token amount"
            />
            <button onClick={handleTransferToken}>Send Token</button>
          </div>
          {tokenTxHash && (
            <p className="tx-hash">Transaction Hash: {tokenTxHash}</p>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default WalletPage;
