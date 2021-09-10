import { Flex, Text, Wrap, WrapItem, IconButton } from '@chakra-ui/react';
import { FaGithubAlt } from 'react-icons/fa';
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
      borderBottom='1px solid lightgray'
    >
      <Text fontSize='xl' fontWeight='bold'>
        {room?.type === RoomType.Dm ? '@' : params.roomId !== '@me' && '#'}
        {room?.name || 'Welcome to ChitChat'}
      </Text>
      <Wrap>
        <WrapItem>
          {room ? (
            <MemberModal />
          ) : (
            <IconButton
              aria-label='source code'
              icon={<FaGithubAlt />}
              as='a'
              href='https://github.com/aseerkt/chit-chat'
              target='_blank'
              rel='no-referrer'
              isRound
            />
          )}
        </WrapItem>
      </Wrap>
    </Flex>
  );
}

export default RoomHeader;
