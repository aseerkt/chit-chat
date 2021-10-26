import { Flex, Text, Wrap, WrapItem } from '@chakra-ui/react';
import { useParams } from 'react-router';
import { useCurrentRoomCtx } from '../context/RoomContext';
import { RoomType } from '../generated/graphql';
import MemberModal from './MemberModal';

function RoomHeader() {
  const params = useParams<{ roomId: string }>();
  const { room } = useCurrentRoomCtx();
  return (
    <Flex
      align='center'
      justify='space-between'
      p='3'
      h='16'
      borderBottom='1px solid lightgray'
    >
      <Text fontSize='xl' fontWeight='bold'>
        {room?.type === RoomType.Dm ? '@' : params.roomId !== '@me' && '#'}
        {room?.name || 'Welcome to ChitChat'}
      </Text>
      <Wrap>
        <WrapItem>{room && <MemberModal />}</WrapItem>
      </Wrap>
    </Flex>
  );
}

export default RoomHeader;
