import {
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Text,
  Avatar,
} from '@chakra-ui/react';
import { Divider, Flex, Box, Badge, HStack } from '@chakra-ui/layout';
import { MdInsertInvitation } from 'react-icons/md';
import { useGetInvitesQuery } from '../../generated/graphql';
import InviteAction from './InviteAction';

function Invites() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [{ data }] = useGetInvitesQuery({ pause: !isOpen });

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
            {data?.getInvites?.recieved && (
              <Box>
                <Text fontWeight='bold'>Recieved</Text>
                <Divider />
                {data.getInvites.recieved.length === 0 && (
                  <Flex
                    borderRadius='md'
                    border='1px solid lightgray'
                    my='2'
                    p='3'
                    align='center'
                  >
                    <Text fontSize='small'>
                      You have not recieved any invites
                    </Text>
                  </Flex>
                )}
                {data.getInvites.recieved.map((i) => (
                  <Flex
                    borderRadius='md'
                    border='1px solid lightgray'
                    my='2'
                    p='3'
                    align='center'
                  >
                    <Box>
                      <HStack spacing='2'>
                        <Avatar size='sm' alt={i.inviter.username} />
                        <strong>{i.inviter.username}</strong>
                      </HStack>
                      <Text mt='2' fontSize='smaller' fontWeight='bold'>
                        {i.info}
                      </Text>
                    </Box>
                    <InviteAction inviteId={i.id} />
                  </Flex>
                ))}
              </Box>
            )}

            {data?.getInvites?.sent && (
              <Box>
                <Text fontWeight='bold'>Sent</Text>
                <Divider />
                {data.getInvites.sent.length === 0 && (
                  <Flex
                    borderRadius='md'
                    border='1px solid lightgray'
                    my='2'
                    p='3'
                    align='center'
                  >
                    <Text fontSize='small'>You have not sent any invites</Text>
                  </Flex>
                )}
                {data.getInvites.sent.map((i) => (
                  <Flex
                    borderRadius='md'
                    border='1px solid lightgray'
                    my='2'
                    p='3'
                    align='center'
                  >
                    <Box>
                      <HStack spacing='2'>
                        <Avatar size='sm' alt={i.invitee.username} />
                        <strong>{i.invitee.username}</strong>
                      </HStack>
                      <Text mt='2' fontSize='smaller' fontWeight='bold'>
                        {i.info}
                      </Text>
                    </Box>
                    <Flex align='center' ml='auto'>
                      <Badge ml='2'>PENDING</Badge>
                    </Flex>
                  </Flex>
                ))}
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Invites;
