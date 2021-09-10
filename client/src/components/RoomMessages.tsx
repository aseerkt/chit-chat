import { Flex, IconButton } from '@chakra-ui/react';
import { Fragment, useEffect, useState } from 'react';
import { FaPlusSquare } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { useScrollCtx } from '../context/MessageScrollCtx';
import {
  GetMessagesQueryVariables,
  useGetMessagesQuery,
  useGetNewMessageSubscription,
} from '../generated/graphql';
import CSpinner from '../shared/CSpinner';
import { isSameDay, isYesterday } from '../utils/dateUtils';
import DateSeperator from './DateSeperator';
import MessageItem from './MessageItem';

function RoomMessages() {
  const params = useParams<{ roomId: string }>();
  const [variables, setVariables] = useState<GetMessagesQueryVariables>({
    roomId: parseInt(params.roomId),
    limit: 20,
  });
  const [{ data, fetching }] = useGetMessagesQuery({
    variables,
    pause: typeof params.roomId === 'undefined' || params.roomId === '@me',
  });

  const { scrollToBottom, ScrollRefComponent } = useScrollCtx();

  useGetNewMessageSubscription({
    variables: { roomId: parseInt(params.roomId) },
    pause: typeof params.roomId === 'undefined' || params.roomId === '@me',
  });

  useEffect(() => {
    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetching]);

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
        {data?.getMessages.nodes.map((msg, index, msgArr) => {
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
              onClick={() => {
                setVariables((prev) => ({
                  ...prev,
                  cursor:
                    data.getMessages.nodes[data.getMessages.nodes.length - 1]
                      .createdAt,
                }));
              }}
            />
          </Flex>
        )}
        {fetching && <CSpinner />}
      </Flex>
    </Flex>
  );
}

export default RoomMessages;
