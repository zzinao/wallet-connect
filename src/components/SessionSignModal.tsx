import { Box, Button, Typography } from '@mui/material';
import { useWalletContext } from '@context/useWalletContext';
import ModalStore from '@store/ModalStore';
import { getSignParamsMessage } from '@utils/helperUtils';
import { useCallback } from 'react';

const SessionSignModal = () => {
  const { web3Wallet, wallet } = useWalletContext();
  const requestEvent = ModalStore.state.data?.requestEvent;
  const requestSession = web3Wallet?.engine.signClient.session.get(requestEvent?.topic!);

  if (!requestEvent || !requestSession) {
    return <Typography>Missing request Data</Typography>;
  }

  const { topic, params, id } = requestEvent;
  const { request } = params;

  const message = getSignParamsMessage(request.params);

  const onApprove = useCallback(async () => {
    if (requestEvent) {
      try {
        const signedMessage = await wallet?.signMessage(message);
        const response = { id, result: signedMessage, jsonrpc: '2.0' };
        await web3Wallet?.respondSessionRequest({
          topic,
          response,
        });
      } catch (error) {
        console.log(error, 'error');
        return;
      }
      ModalStore.close();
    }
  }, [requestEvent, topic]);

  const onReject = useCallback(async () => {
    if (requestEvent) {
      try {
        const response = {
          id,
          jsonrpc: '2.0',
          error: {
            code: 5000,
            message: 'User rejected.',
          },
        };
        await web3Wallet?.respondSessionRequest({
          topic,
          response,
        });
      } catch (error) {
        console.log(error);
      }
      ModalStore.close();
    }
  }, [requestEvent, topic]);
  return (
    <Box className="flex flex-col gap-5 justify-center items-center">
      <Typography variant="h5">Request a signature</Typography>
      <Typography>message: {message}</Typography>
      <Box className="flex gap-4">
        <Button onClick={onReject} variant="contained">
          Reject
        </Button>
        <Button onClick={onApprove} variant="contained">
          Approve
        </Button>
      </Box>
    </Box>
  );
};

export default SessionSignModal;
