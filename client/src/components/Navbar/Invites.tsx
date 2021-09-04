import {
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { MdInsertInvitation } from 'react-icons/md';

function Invites() {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <IconButton
        aria-label='invites'
        size='lg'
        icon={<MdInsertInvitation size='1.4em' />}
        onClick={onOpen}
      />
      <Modal onClose={onClose} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Invites</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Hello</ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Invites;
