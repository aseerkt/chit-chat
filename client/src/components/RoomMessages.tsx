import { Flex } from '@chakra-ui/react';
import { useCallback, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  GetNewMessageDocument,
  GetNewMessageSubscription,
  useGetMessagesQuery,
} from '../generated/graphql';
import CSpinner from '../shared/CSpinner';
import MessageItem from './MessageItem';

function RoomMessages() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const params: any = useParams();
  const { data, loading, subscribeToMore } = useGetMessagesQuery({
    variables: { roomId: parseInt(params.roomId) },
    skip: typeof params.roomId === 'undefined' || params.roomId === '@me',
  });

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView(/*{ behavior: 'smooth' }*/);
  };

  const subscribeForMessages = useCallback(() => {
    subscribeToMore<GetNewMessageSubscription>({
      document: GetNewMessageDocument,
      variables: { roomId: parseInt(params.roomId) },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newMessageData = subscriptionData.data.getNewMessage;
        return {
          getMessages: [...prev.getMessages, newMessageData],
        };
      },
    });
    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.roomId]);

  useEffect(() => {
    if (!!params.roomId) {
      subscribeForMessages();
      scrollToBottom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [data]);

  if (loading) return <CSpinner />;

  return (
    <Flex direction='column' flex='1' h='full' overflowY='scroll'>
      <Flex mt='auto' direction='column' justify='flex-end'>
        {data?.getMessages.map((msg) => (
          <MessageItem key={msg.id} msg={msg} />
        ))}
      </Flex>
      <div ref={scrollRef}></div>
    </Flex>
  );
}

export default RoomMessages;
