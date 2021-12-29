import { Flex, Text, chakra, IconButton } from '@chakra-ui/react';
import { Fragment, useEffect, useState } from 'react';
import { FiEdit2 } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import { useScrollCtx } from '../context/MessageScrollCtx';
import {
  GetMessagesQueryVariables,
  useGetMessagesQuery,
  useGetNewMessageSubscription,
  useMeQuery,
} from '../generated/graphql';
import CSpinner from '../shared/CSpinner';
import { isSameDay, isYesterday } from '../utils/dateUtils';
import DateSeperator from './DateSeperator';
import MessageItem from './MessageItem';

function RoomMessages() {
  const params = useParams<{ roomId: string }>();
  const [variables, setVariables] = useState<GetMessagesQueryVariables>({
    roomId: parseInt(params!.roomId!),
    limit: 20,
    cursor: null,
  });
  const { ScrollRefComponent } = useScrollCtx();

  const [{ data, fetching }] = useGetMessagesQuery({
    variables,
    pause: typeof params.roomId === 'undefined' || params.roomId === '@me',
  });
  const [{ data: meData }] = useMeQuery();

  useGetNewMessageSubscription({
    pause: typeof params.roomId === 'undefined' || params.roomId === '@me',
  });

  useEffect(() => {
    setVariables((prev) => ({
      ...prev,
      cursor: null,
      roomId: parseInt(params!.roomId!),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.roomId]);

  if (params!.roomId!.includes('@'))
    return (
      <Flex
        h='full'
        justify='center'
        align='center'
        direction='column'
        gap='1rem'
      >
        <Text>
          Hi there,{' '}
          <chakra.span fontWeight='bold'>{meData?.me.fullName}</chakra.span>
        </Text>
        <Text>
          Click on{' '}
          <IconButton
            icon={<FiEdit2 />}
            aria-label='create room ref'
            size='xs'
            colorScheme='teal'
            isRound
          />{' '}
          icon to create chat room
        </Text>
      </Flex>
    );

  return (
    <Flex direction='column' flex='1' overflowY='hidden'>
      <Flex
        mt='auto'
        direction='column-reverse'
        h='full'
        overflowY='auto'
        onScroll={(e) => {
          const { scrollHeight, clientHeight, scrollTop } = e.currentTarget;
          if (
            data?.getMessages.hasMore &&
            scrollHeight - 5 < clientHeight - scrollTop
          ) {
            setVariables((prev) => ({
              ...prev,
              cursor:
                data.getMessages.nodes[data.getMessages.nodes.length - 1]
                  .createdAt,
            }));
          }
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
        {fetching && <CSpinner />}
        {params.roomId === '@me' && <Flex h='full' w='full'></Flex>}
      </Flex>
    </Flex>
  );
}

export default RoomMessages;
