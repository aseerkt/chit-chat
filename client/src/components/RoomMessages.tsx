import { Flex } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useCurrentRoomCtx } from '../context/RoomContext';
import {
  GetMyRoomsDocument,
  GetMyRoomsQuery,
  MessageFieldsFragment,
  MessageFieldsFragmentDoc,
  RoomFieldsFragment,
  RoomFieldsFragmentDoc,
  useGetNewMessageSubscription,
} from '../generated/graphql';
import CSpinner from '../shared/CSpinner';
import MessageItem from './MessageItem';

function RoomMessages() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const params: any = useParams();
  const { loading, room } = useCurrentRoomCtx();

  useGetNewMessageSubscription({
    variables: { roomId: parseInt(params.roomId) },
    skip: typeof params.roomId === 'undefined' || params.roomId === '@me',
    onSubscriptionData: ({ client, subscriptionData }) => {
      const newMessage = subscriptionData.data?.getNewMessage;
      if (newMessage) {
        const prevRoomData = client.readFragment<RoomFieldsFragment>({
          fragment: RoomFieldsFragmentDoc,
          fragmentName: 'RoomFields',
          id: `Room:${params.roomId}`,
        });
        if (prevRoomData) {
          client.writeFragment<RoomFieldsFragment>({
            fragment: RoomFieldsFragmentDoc,
            fragmentName: 'RoomFields',
            id: `Room:${params.roomId}`,
            data: {
              ...prevRoomData,
              messages: [...prevRoomData.messages, newMessage],
            },
          });
          scrollToBottom();
        }
      }
    },
  });

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView(/*{ behavior: 'smooth' }*/);
  };

  useEffect(() => {
    scrollToBottom();
  }, [room]);

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
