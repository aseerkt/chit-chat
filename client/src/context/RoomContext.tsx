import { createContext, useContext, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Room, useGetMyRoomsQuery } from '../generated/graphql';

interface RoomCtxType {
  loading: boolean;
  room?: Room;
}

const RoomCtx = createContext<RoomCtxType>(null as any);

function CurrentRoomProvider({ children }: { children: React.ReactNode }) {
  const params: any = useParams();
  const history = useHistory();
  const [{ fetching, data }] = useGetMyRoomsQuery();

  const [room, setRoom] = useState<Room | undefined>();

  useEffect(() => {
    const currentRoom = data?.getMyRooms.find(
      (r) => r.id === parseInt(params.roomId)
    );
    if (!currentRoom) history.replace('/room/@me');
    else setRoom(currentRoom as Room);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.roomId, data]);

  return (
    <RoomCtx.Provider value={{ loading: fetching, room }}>
      {children}
    </RoomCtx.Provider>
  );
}

export const useCurrentRoomCtx = () => useContext(RoomCtx);

export default CurrentRoomProvider;
