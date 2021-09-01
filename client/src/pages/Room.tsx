import { Flex } from '@chakra-ui/react';
import AddMessage from '../components/AddMessage';
import ListRooms from '../components/ListRooms';
import RoomHeader from '../components/RoomHeader';
import RoomMessages from '../components/RoomMessages';
import UserHeader from '../components/UserHeader';
import CurrentRoomProvider from '../context/RoomContext';

function Room() {
  return (
    <CurrentRoomProvider>
      <Flex border='1px solid lightgray' borderRadius='sm' h='full'>
        <Flex
          maxW='72'
          w='full'
          h='full'
          flexDirection='column'
          borderRight='1px solid lightgray'
        >
          <UserHeader />
          <ListRooms />
        </Flex>
        <Flex flex='1' direction='column'>
          <RoomHeader />
          <RoomMessages />
          <AddMessage />
        </Flex>
      </Flex>
    </CurrentRoomProvider>
  );
}

export default Room;
