import { useEffect, useState } from 'react';
import { createWeb3Wallet, generateAccount } from '@utils/walletConnectUtil';
import { IWeb3Wallet } from '@walletconnect/web3wallet';
import { ethers } from 'ethers';

export interface WalletDataType {
  web3Wallet: IWeb3Wallet;
  wallet: ethers.Wallet;
  address: string;
}

const useWalletInitalize = () => {
  const [initialized, setInitialized] = useState(false);
  const [web3Wallet, setWeb3Wallet] = useState<IWeb3Wallet>();
  const [walletData, setWalletData] = useState<WalletDataType>();

  const init = async () => {
    const web3WalletInstance = await createWeb3Wallet();
    const wallet = generateAccount();

    if (web3WalletInstance && wallet) {
      setWalletData({
        web3Wallet: web3WalletInstance,
        wallet,
        address: wallet.address,
      });
      setWeb3Wallet(web3WalletInstance);
      setInitialized(true);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return { initialized, walletData, web3Wallet };
};

export default useWalletInitalize;
