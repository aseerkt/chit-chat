import { Flex, Text } from '@chakra-ui/react';
import { useCurrentRoomCtx } from '../context/RoomContext';
import { RoomType } from '../generated/graphql';

function RoomHeader() {
  const { room } = useCurrentRoomCtx();
  return (
    <Flex h='16' align='center' px='3' borderBottom='1px solid lightgray'>
      <Text fontSize='xl' fontWeight='bold'>
        {room?.type === RoomType.Dm ? '@' : '#'}
        {room?.name || 'Welcome'}
      </Text>
    </Flex>
  );
}

export default RoomHeader;
