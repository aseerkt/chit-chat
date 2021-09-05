import { createContext, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Room, useGetMyRoomsQuery } from '../generated/graphql';

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

  return (
    <RoomCtx.Provider value={{ loading, room }}>{children}</RoomCtx.Provider>
  );
}

export const useCurrentRoomCtx = () => useContext(RoomCtx);

export default CurrentRoomProvider;
