import { NetworkStatus } from '@apollo/client';
import { Flex, IconButton } from '@chakra-ui/react';
import { Fragment, useCallback, useEffect } from 'react';
import { FaPlusSquare } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { useScrollCtx } from '../context/MessageScrollCtx';
import {
  GetNewMessageDocument,
  GetNewMessageSubscription,
  useGetMessagesQuery,
} from '../generated/graphql';
import CSpinner from '../shared/CSpinner';
import { isSameDay, isYesterday } from '../utils/dateUtils';
import DateSeperator from './DateSeperator';
import MessageItem from './MessageItem';

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
      updateQuery: (prev, { subscriptionData }) => {
        const newMessage = subscriptionData.data?.getNewMessage;
        if (!newMessage) return prev;
        return Object.assign({}, prev, {
          getMessages: {
            hasMore: 'sub',
            messages: [newMessage],
          },
        });
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
        onScroll={(e) => {
          // console.log(e.currentTarget.scrollTop);
        }}
      >
        <ScrollRefComponent />
        {data?.getMessages.messages.map((msg, index, msgArr) => {
          let separatorText: string | null = null;
          if (index !== msgArr.length - 1) {
            let currentMsgDate = msg.createdAt;
            let nextMsgDate = msgArr[index + 1].createdAt;
            if (
              isSameDay(currentMsgDate) === true &&
              isSameDay(nextMsgDate) !== true
            )
              separatorText = 'Today';
            else if (
              isYesterday(currentMsgDate) === true &&
              isYesterday(nextMsgDate) !== true
            )
              separatorText = 'Yesterday';
          } else {
            if (isSameDay(msg.createdAt)) separatorText = 'Today';
          }
          return (
            <Fragment key={msg.id}>
              <MessageItem msg={msg} />
              {separatorText && <DateSeperator>{separatorText}</DateSeperator>}
            </Fragment>
          );
        })}
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
