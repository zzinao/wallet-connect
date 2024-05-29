import { IWeb3Wallet } from '@walletconnect/web3wallet';
import { ethers } from 'ethers';
import { createContext, useMemo } from 'react';

interface WalletContextType {
  web3Wallet?: IWeb3Wallet;
  wallet?: ethers.Wallet;
  address?: string;
}

export const WalletContext = createContext<WalletContextType | undefined>(undefined);

const WalletStateContext = (props: React.PropsWithChildren<WalletContextType>) => {
  const contextValue = useMemo(
    () => ({
      ...props,
    }),
    [props]
  );

  return <WalletContext.Provider value={contextValue}>{props.children}</WalletContext.Provider>;
};

export default WalletStateContext;
