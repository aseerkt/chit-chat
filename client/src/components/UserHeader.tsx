import { Avatar, Flex, Text } from '@chakra-ui/react';
import { useMeQuery } from '../generated/graphql';
import CreateRoomModal from './CreateRoom/CreateRoomModal';

function UserHeader() {
  const { data } = useMeQuery();

  return (
    <Flex
      cursor='pointer'
      p='3'
      align='center'
      justify='space-between'
      borderBottom='1px solid lightgray'
      h='16'
    >
      <Flex align='center'>
        <Avatar
          size='md'
          name={data?.me.fullName}
          src='https://bit.ly/tioluwani-kolawole'
          mr='2'
        />
        <Text fontSize='xl' fontWeight='bold'>
          {data?.me.username}
        </Text>
      </Flex>
      <CreateRoomModal />
    </Flex>
  );
}

export default UserHeader;
