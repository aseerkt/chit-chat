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
import { Divider, Flex } from '@chakra-ui/layout';
import { MdInsertInvitation } from 'react-icons/md';
import { useMeQuery } from '../../generated/graphql';

function Invites() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [{ data }] = useMeQuery();

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
          <ModalBody>
            <h1>Recieved</h1>
            <Divider />
            {data?.me.invites?.recieved?.map((i) => (
              <Flex>{i.inviter.username}</Flex>
            ))}

            <h1>Sent</h1>
            <Divider />
            {data?.me.invites?.sent?.map((i) => (
              <Flex>{i.invitee.username}</Flex>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Invites;
