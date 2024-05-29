import { useMemo } from 'react';
import { useSnapshot } from 'valtio';
import { Dialog, Box } from '@mui/material';
import ModalStore from '@store/ModalStore';
import SessionProposalModal from './SessionProposalModal';
import SessionSignModal from './SessionSignModal';

const Modal = () => {
  const { open, view } = useSnapshot(ModalStore.state);

  const componentView = useMemo(() => {
    switch (view) {
      case 'SessionProposalModal':
        return <SessionProposalModal />;
      case 'SessionSignModal':
        return <SessionSignModal />;

      default:
        return <SessionProposalModal />;
    }
  }, [view]);

  return (
    <Dialog open={open} onClose={close}>
      <Box className="p-8">{componentView}</Box>
    </Dialog>
  );
};

export default Modal;
