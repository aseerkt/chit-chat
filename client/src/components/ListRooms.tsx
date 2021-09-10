import { Box } from '@chakra-ui/react';
import { Room, useGetMyRoomsQuery } from '../generated/graphql';
import CSpinner from '../shared/CSpinner';
import RoomItem from './RoomItem';

function ListRooms() {
  const [{ data, fetching }] = useGetMyRoomsQuery();
  if (fetching) return <CSpinner />;

  return (
    <Box h='full' overflowY='auto'>
      {data?.getMyRooms.map((r) => (
        <RoomItem key={r.id} room={r as Room} />
      ))}{' '}
    </Box>
  );
}

export default ListRooms;
