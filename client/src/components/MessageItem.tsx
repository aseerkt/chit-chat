import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
import { Message, useMeQuery } from '../generated/graphql';

interface MessageProps {
  msg: Message;
}

function MessageItem({ msg }: MessageProps) {
  const [{ data }] = useMeQuery();
  const isMe = data?.me.id === msg.sender?.id;

  return (
    <Flex
      p='3'
      alignSelf={isMe ? 'flex-end' : 'flex-start'}
      bg={isMe ? 'gray.200' : 'white'}
      border='1px solid lightgray'
      borderRadius='xl'
      alignItems='flex-start'
      my='1'
      mx='3'
    >
      <Avatar name={msg.sender?.username} mr='2' />
      <Box>
        <Flex align='center'>
          <Text fontWeight='bold' mr='2'>
            {msg.sender?.username}
          </Text>
          <Text fontSize='x-small' color='gray.500'>
            {new Date(msg.createdAt)
              .toLocaleTimeString('en-IN', {
                hour12: true,
              })
              .toUpperCase()}
          </Text>
        </Flex>
        <Text fontSize='sm'>{msg.text}</Text>
      </Box>
    </Flex>
  );
}

export default MessageItem;
