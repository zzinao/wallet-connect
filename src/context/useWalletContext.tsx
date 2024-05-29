import { useContext } from 'react';
import { WalletContext } from './WalletContext';

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('WalletContext 내부에서만 사용');
  }

  return context;
};
