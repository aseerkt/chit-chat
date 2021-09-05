import { Flex, IconButton, Text, Wrap, WrapItem } from '@chakra-ui/react';
import { FaInfoCircle } from 'react-icons/fa';
import { useCurrentRoomCtx } from '../context/RoomContext';
import { RoomType } from '../generated/graphql';

function RoomHeader() {
  const { room } = useCurrentRoomCtx();
  return (
    <Flex
      align='center'
      justify='space-between'
      p='3'
      borderBottom='1px solid lightgray'
    >
      <Text fontSize='xl' fontWeight='bold'>
        {room?.type === RoomType.Dm ? '@' : '#'}
        {room?.name || 'Welcome'}
      </Text>
      <Wrap>
        <WrapItem>
          <IconButton aria-label='room info' icon={<FaInfoCircle />} isRound />
        </WrapItem>
      </Wrap>
    </Flex>
  );
}

export default RoomHeader;
