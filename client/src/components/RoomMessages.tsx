import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Flex, IconButton } from '@chakra-ui/react';
import { FaPlusSquare } from 'react-icons/fa';
import { useScrollCtx } from '../context/MessageScrollCtx';
import {
  GetNewMessageDocument,
  GetNewMessageSubscription,
  useGetMessagesQuery,
} from '../generated/graphql';
import CSpinner from '../shared/CSpinner';
import MessageItem from './MessageItem';
import { NetworkStatus } from '@apollo/client';

function RoomMessages() {
  const params = useParams<{ roomId: string }>();
  const {
    data,
    variables: getMessagesVariables,
    networkStatus,
    fetchMore,
    subscribeToMore,
  } = useGetMessagesQuery({
    variables: { roomId: parseInt(params.roomId), limit: 8 },
    skip: typeof params.roomId === 'undefined' || params.roomId === '@me',
    notifyOnNetworkStatusChange: true,
  });

  const { scrollToBottom, ScrollRefComponent } = useScrollCtx();

  const fetchMoreMessages = useCallback(() => {
    const oldMsgDate = data?.getMessages.messages.reduce((prev, curr) => {
      return prev < curr.createdAt ? prev : curr.createdAt;
    }, new Date());
    fetchMore({
      variables: {
        cursor: oldMsgDate,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.roomId, networkStatus]);

  const subscribeForMessages = useCallback(() => {
    subscribeToMore<GetNewMessageSubscription>({
      document: GetNewMessageDocument,
      variables: getMessagesVariables,
      updateQuery: (prevMsgData, { subscriptionData, variables }) => {
        const newMessage = subscriptionData.data?.getNewMessage;
        if (!newMessage) return prevMsgData;
        return {
          getMessages: {
            ...prevMsgData.getMessages,
            messages: [newMessage, ...prevMsgData.getMessages.messages],
          },
        };
      },
    });
    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.roomId]);

  useEffect(() => {
    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networkStatus === NetworkStatus.loading]);

  useEffect(() => {
    subscribeForMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.roomId]);

  if (networkStatus === NetworkStatus.loading) return <CSpinner />;

  return (
    <Flex direction='column' flex='1' justify='flex-end' overflowY='hidden'>
      <Flex
        mt='auto'
        direction='column-reverse'
        minH='min-content'
        overflowY='auto'
      >
        <ScrollRefComponent />
        {data?.getMessages.messages.map((msg) => (
          <MessageItem key={msg.id} msg={msg} />
        ))}
        {data?.getMessages?.hasMore && (
          <Flex justify='center' my='3'>
            <IconButton
              aria-label='fetch more button'
              icon={<FaPlusSquare />}
              isRound
              size='md'
              colorScheme='green'
              onClick={fetchMoreMessages}
            />
          </Flex>
        )}
        {networkStatus === NetworkStatus.fetchMore && <CSpinner />}
      </Flex>
    </Flex>
  );
}

export default RoomMessages;
