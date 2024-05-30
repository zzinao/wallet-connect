import { useState } from 'react';
import { parseUri } from '@walletconnect/utils';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useWalletContext } from '@context/useWalletContext';
import ModalStore from '@store/ModalStore';
import { useSnapshot } from 'valtio';
import SessionStore from '@store/SessionStore';

const WalletConnect = () => {
  const [uri, setUri] = useState('');
  const { web3Wallet, address } = useWalletContext();
  const { session } = useSnapshot(SessionStore.state);
  console.log('ADDRESS:', address);

  const onPair = async () => {
    const { topic: paringTopic } = parseUri(uri);

    const pairingExpiredListener = ({ topic }: { topic: string }) => {
      if (paringTopic === topic) {
        alert('페어링 만료!');
        ModalStore.close();
        web3Wallet?.core.pairing.events.removeListener('pairing_expire', pairingExpiredListener);
      }
    };
    web3Wallet?.once('session_proposal', () => {
      web3Wallet?.core.pairing.events.removeListener('pairing_expire', pairingExpiredListener);
    });
    if (uri && address) {
      try {
        web3Wallet?.core.pairing.events.on('pairing_expire', pairingExpiredListener);
        console.log('pairing with uri', uri);
        await web3Wallet?.pair({ uri });
      } catch (e) {
        console.error('Error pairing with uri', e);
      } finally {
        setUri('');
      }
    }
  };

  const onDisconnect = () => {
    try {
      web3Wallet?.disconnectSession({
        topic: session?.topic!,
        reason: {
          code: 5000,
          message: 'User disconnected',
        },
      });
    } catch (error) {
      console.log(error, 'error');
    } finally {
      SessionStore.setSession(undefined);
      alert('disconnect success');
    }
  };

  return (
    <Box className="flex flex-col h-screen justify-center items-center gap-4">
      <Typography variant="h4">Wallet Connect Test</Typography>
      <Typography>generateAccount: {address ?? 'loading...'}</Typography>
      <Box className="flex items-center gap-3">
        <TextField
          value={uri}
          type="text"
          onChange={e => setUri(e.target.value)}
          placeholder="Enter Wallet Connect URI"
          className="w-[400px]"
        />
        <Button variant="contained" onClick={onPair} disabled={!address}>
          pair
        </Button>
      </Box>
      {session ? <Button onClick={onDisconnect}>Disconnect Session</Button> : null}
    </Box>
  );
};

export default WalletConnect;
