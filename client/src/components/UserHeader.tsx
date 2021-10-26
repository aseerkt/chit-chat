import { Avatar, Flex, Text, Wrap, WrapItem } from '@chakra-ui/react';
import { useMeQuery } from '../generated/graphql';
import CreateRoomModal from './CreateRoom/CreateRoomModal';

function UserHeader() {
  const [{ data: meData }] = useMeQuery();

  return (
    <Flex
      p='3'
      h='16'
      align='center'
      justify='space-between'
      borderBottom='1px solid lightgray'
    >
      <Flex align='center'>
        <Avatar size='sm' name={meData?.me.username} mr='2' />
        <Text fontSize='xl' fontWeight='bold'>
          {meData?.me.username}
        </Text>
      </Flex>
      <Wrap>
        <WrapItem>
          <CreateRoomModal />
        </WrapItem>
      </Wrap>
    </Flex>
  );
}

export default UserHeader;
