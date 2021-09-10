import { IconButton } from '@chakra-ui/button';
import { useDisclosure } from '@chakra-ui/hooks';
import { Flex, Text } from '@chakra-ui/layout';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import { FaInfoCircle, FaLock } from 'react-icons/fa';
import { useCurrentRoomCtx } from '../context/RoomContext';
import { RoomType } from '../generated/graphql';

function MemberModal() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { room } = useCurrentRoomCtx();
  return (
    <>
      <IconButton
        onClick={onOpen}
        aria-label='room info'
        icon={<FaInfoCircle />}
        isRound
      />
      <Modal scrollBehavior='inside' isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {room?.type === RoomType.Dm
              ? `@${room?.name}`
              : `#${room?.name} members`}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Created At:{' '}
              {new Date(room?.createdAt).toLocaleDateString('en-IN', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
              })}
            </Text>
            {room?.members.map((m) => (
              <Flex key={`member_${room.id}_${m.userId}`}>
                <Text>{m.user.username}</Text>
                {m.user.private && <FaLock />}
                <Text>{m.role}</Text>
              </Flex>
            ))}
          </ModalBody>

          <ModalFooter fontSize='xs'>
            <FaLock />*
            <Text size='xs' ml='2'>
              Private Account
            </Text>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default MemberModal;
