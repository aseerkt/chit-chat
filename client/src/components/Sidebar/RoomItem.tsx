import { Avatar, Flex, Icon } from '@chakra-ui/react';
import { FaUser, FaUsers } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import { Room, RoomType } from '../../generated/graphql';

interface RoomItemProps {
  room: Room;
}

function RoomItem({ room }: RoomItemProps) {
  const params: any = useParams();

  return (
    <Flex
      as={Link}
      to={`/room/${room.id}`}
      p='3'
      bg={params.roomId === String(room.id) ? 'gray.100' : 'white'}
      align='center'
    >
      <Avatar size='sm' name={room.name} mr='2' />
      <strong>{room.name}</strong>
      <Icon ml='auto' as={room.type === RoomType.Dm ? FaUser : FaUsers} />
    </Flex>
  );
}

export default RoomItem;
