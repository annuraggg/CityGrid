import { createContext, useContext, useState } from 'react';
import Web3 from 'web3';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const Web3Context = createContext<{
  web3?: Web3;
  account?: string;
  connectWallet?: () => Promise<void>;
}>({});

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [web3, setWeb3] = useState<Web3>();
  const [account, setAccount] = useState<string>();

  const connectWallet = async () => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3Instance.eth.getAccounts();
        setWeb3(web3Instance);
        setAccount(accounts[0]);
      } catch (error) {
        console.error('User denied account access');
      }
    }
  };

  return (
    <Web3Context.Provider value={{ web3, account, connectWallet }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);