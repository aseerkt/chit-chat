import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
} from '@chakra-ui/react';
import CSpinner from '../../shared/CSpinner';

interface CreateRoomLoaderProps {
  creating: boolean;
}

function CreateRoomLoader({ creating }: CreateRoomLoaderProps) {
  return (
    <Modal isOpen={creating} onClose={() => {}}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Creating Room</ModalHeader>
        <ModalBody>
          <CSpinner />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default CreateRoomLoader;
