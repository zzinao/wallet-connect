import { useEffect } from 'react';
import { RELAYER_EVENTS } from '@walletconnect/core';
import useWalletConnectEventsManager from '@hooks/useWalletConnectEventsmanager';
import useWalletInitalize from '@hooks/useWalletInitialize';
import WalletStateContext from '@context/WalletContext';
import Modal from '@components/Modal';
import WalletConnect from '@components/WalletConnect';

function App() {
  const { initialized, web3Wallet, walletData } = useWalletInitalize();

  useWalletConnectEventsManager(initialized, walletData?.web3Wallet!);

  useEffect(() => {
    if (!initialized || !walletData) return;
    web3Wallet?.core.relayer.on(RELAYER_EVENTS.connect, () => {
      console.log('Network connection is restored!', 'success');
    });

    web3Wallet?.core.relayer.on(RELAYER_EVENTS.disconnect, () => {
      console.log('Network connection lost.', 'error');
    });
  }, [initialized]);

  return (
    <WalletStateContext {...walletData}>
      <WalletConnect />
      <Modal />
    </WalletStateContext>
  );
}

export default App;
