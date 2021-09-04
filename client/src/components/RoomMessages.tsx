import { Flex } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useCurrentRoomCtx } from '../context/RoomContext';

import MessageItem from './MessageItem';

function RoomMessages() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { room } = useCurrentRoomCtx();

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView(/*{ behavior: 'smooth' }*/);
  };

  useEffect(() => {
    scrollToBottom();
  }, [room?.messages]);

  return (
    <Flex direction='column' flex='1' h='full' overflowY='scroll'>
      <Flex mt='auto' direction='column' justify='flex-end'>
        {room?.messages.map((msg) => (
          <MessageItem key={msg.id} msg={msg} />
        ))}
      </Flex>
      <div ref={scrollRef}></div>
    </Flex>
  );
}

export default RoomMessages;
