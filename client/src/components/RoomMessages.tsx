import { Flex, IconButton } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { FaPlusSquare } from 'react-icons/fa';
import { useCurrentRoomMessagesCtx } from '../context/MessageCtx';
import CSpinner from '../shared/CSpinner';

import MessageItem from './MessageItem';

function RoomMessages() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { paginatedMessages, loading, fetchMoreMessages, fetchingMore } =
    useCurrentRoomMessagesCtx();

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView(/*{ behavior: 'smooth' }*/);
  };

  useEffect(() => {
    scrollToBottom();
  }, [paginatedMessages?.messages]);

  if (loading) return <CSpinner />;

  return (
    <Flex direction='column' flex='1' h='full' overflowY='scroll'>
      <Flex mt='auto' direction='column' justify='flex-end'>
        {paginatedMessages?.hasMore && (
          <IconButton
            aria-label='fetch more button'
            icon={<FaPlusSquare />}
            onClick={fetchMoreMessages}
          />
        )}
        {fetchingMore && <CSpinner />}
        {paginatedMessages?.messages.map((msg) => (
          <MessageItem key={msg.id} msg={msg} />
        ))}
      </Flex>
      <div ref={scrollRef}></div>
    </Flex>
  );
}

export default RoomMessages;
