import { useSnapshot } from 'valtio';
import { Avatar, Box, Button, Typography } from '@mui/material';
import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils';
import { useWalletContext } from '@context/useWalletContext';
import ModalStore from '@store/ModalStore';
import { useCallback } from 'react';
import SessionStore from '@store/SessionStore';

const SessionProposalModal = () => {
  const { web3Wallet, wallet } = useWalletContext();
  const { data } = useSnapshot(ModalStore.state);
  const chain = { id: 1 };

  const onReject = useCallback(async () => {
    if (data?.proposal) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await web3Wallet?.rejectSession({
          id: data?.proposal.id,
          reason: getSdkError('USER_REJECTED_METHODS'),
        });
      } catch (e) {
        alert((e as Error).message);
        console.log(e, 'error');
        return;
      }
    }
    ModalStore.close();
  }, [data?.proposal]);

  const onApprove = useCallback(async () => {
    const { id, params } = data?.proposal!;
    try {
      if (!wallet?.address) {
        throw new Error('address not availble');
      }

      const namespaces = {
        proposal: params,
        supportedNamespaces: {
          eip155: {
            chains: [`eip155:${chain.id}`],
            methods: ['eth_sendTransaction', 'personal_sign'],
            events: ['accountsChanged', 'chainChanged'],
            accounts: [`eip155:${chain.id}:${wallet?.address}`],
          },
        },
      };

      const approvedNamespaces = buildApprovedNamespaces(namespaces as any);

      const session = await web3Wallet?.approveSession({
        id,
        namespaces: approvedNamespaces,
      });
      SessionStore.setSession(session);
    } catch (error) {
      await web3Wallet?.rejectSession({
        id,
        reason: getSdkError('USER_REJECTED'),
      });
    }

    ModalStore.close();
  }, []);

  return (
    <Box className="flex flex-col gap-5 justify-center items-center">
      <Typography variant="h5">Requested permissions</Typography>
      <Avatar
        alt="dapp"
        src={data?.proposal?.params?.proposer?.metadata?.icons[0]}
        sx={{ width: 40, height: 40 }}
      />
      <Typography variant="h6">
        {data?.proposal?.params?.proposer?.metadata?.name} 과 연결?
      </Typography>
      <Box className="flex gap-2">
        <Button onClick={onReject} variant="contained">
          reject
        </Button>
        <Button onClick={onApprove} variant="contained">
          approve
        </Button>
      </Box>
    </Box>
  );
};

export default SessionProposalModal;
