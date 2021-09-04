import { createContext, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Room,
  RoomFieldsFragment,
  RoomFieldsFragmentDoc,
  useGetMyRoomsQuery,
  useGetNewMessageSubscription,
} from '../generated/graphql';

interface RoomCtxType {
  loading: boolean;
  room?: Room;
}

const RoomCtx = createContext<RoomCtxType>(null as any);

function CurrentRoomProvider({ children }: { children: React.ReactNode }) {
  const params: any = useParams();
  const { loading, data } = useGetMyRoomsQuery();
  const [room, setRoom] = useState<Room | undefined>();

  useEffect(() => {
    const currentRoom = data?.getMyRooms.find(
      (r) => r.id === parseInt(params.roomId)
    );
    setRoom(currentRoom as Room);
  }, [params.roomId, data]);

  useGetNewMessageSubscription({
    variables: { roomId: parseInt(params.roomId) },
    skip: typeof params.roomId === 'undefined' || params.roomId === '@me',
    onSubscriptionData: ({ client, subscriptionData }) => {
      const newMessage = subscriptionData.data?.getNewMessage;
      console.log(subscriptionData);
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
        }
      }
    },
  });

  return (
    <RoomCtx.Provider value={{ loading, room }}>{children}</RoomCtx.Provider>
  );
}

export const useCurrentRoomCtx = () => useContext(RoomCtx);

export default CurrentRoomProvider;
