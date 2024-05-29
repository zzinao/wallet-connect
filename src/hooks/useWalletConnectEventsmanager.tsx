import { useCallback, useEffect } from 'react';
import { IWeb3Wallet, Web3WalletTypes } from '@walletconnect/web3wallet';
import ModalStore from '@store/ModalStore';
import SessionStore from '@store/SessionStore';

const useWalletConnectEventsManager = (initialized: boolean, web3Wallet: IWeb3Wallet) => {
  const onSessionProposal = useCallback(async (proposal: Web3WalletTypes.SessionProposal) => {
    console.log('session_proposal', proposal);
    ModalStore.open('SessionProposalModal', { proposal });
  }, []);

  const onSessionRequest = useCallback(async (requestEvent: Web3WalletTypes.SessionRequest) => {
    console.log('session_request', requestEvent);
    ModalStore.open('SessionSignModal', { requestEvent });
  }, []);

  useEffect(() => {
    if (initialized && web3Wallet) {
      web3Wallet.on('session_proposal', onSessionProposal);
      web3Wallet.on('session_request', onSessionRequest);

      const activeSessions = web3Wallet?.getActiveSessions();

      if (activeSessions) {
        const currentSession = Object.values(activeSessions)[0];
        SessionStore.setSession(currentSession);
      }
    }

    return () => {
      web3Wallet?.off('session_proposal', onSessionProposal);
      web3Wallet?.off('session_request', onSessionRequest);
    };
  });
};

export default useWalletConnectEventsManager;
