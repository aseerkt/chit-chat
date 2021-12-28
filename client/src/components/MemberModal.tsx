import { Avatar } from '@chakra-ui/avatar';
import { IconButton } from '@chakra-ui/button';
import { useDisclosure } from '@chakra-ui/hooks';
import { Badge, Divider, List, ListItem, Text } from '@chakra-ui/layout';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import { FaInfoCircle } from 'react-icons/fa';
import { useCurrentRoomCtx } from '../context/RoomContext';
import { MemberRole, RoomType } from '../generated/graphql';

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
        size='sm'
      />
      <Modal scrollBehavior='inside' isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {`${room?.type === RoomType.Dm ? '@' : '#'}${room?.name}`}
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
            <Divider />
            <Text fontWeight='bold' fontSize='lg' my='4'>
              Members
            </Text>
            <List align='center'>
              {room?.members.map((m) => (
                <ListItem
                  d='flex'
                  my='2'
                  alignItems='center'
                  key={`member_${room.id}_${m.userId}`}
                >
                  <Avatar size='sm' alt={m.user.username} />
                  <Text fontWeight='bold' mx='2'>
                    {m.user.username}
                  </Text>
                  <Badge
                    ml='auto'
                    colorScheme={
                      m.role === MemberRole.Admin
                        ? 'blue'
                        : m.role === MemberRole.Member
                        ? 'green'
                        : 'red'
                    }
                  >
                    {m.role}
                  </Badge>
                </ListItem>
              ))}
            </List>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default MemberModal;
