import { Flex, Text, Wrap, WrapItem } from '@chakra-ui/react';
import { useCurrentRoomCtx } from '../context/RoomContext';
import { RoomType } from '../generated/graphql';
import MemberModal from './MemberModal';

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
          <MemberModal />
        </WrapItem>
      </Wrap>
    </Flex>
  );
}

export default RoomHeader;
