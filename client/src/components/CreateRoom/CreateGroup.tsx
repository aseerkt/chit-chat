import {
  Badge,
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import {
  RoomType,
  useAllUsersQuery,
  useCreateRoomMutation,
  useMeQuery,
  User,
} from '../../generated/graphql';
import useSearchUser from '../../hooks/useSearchUser';
import CSpinner from '../../shared/CSpinner';
import CreateRoomLoader from './CreateRoomLoader';
import { CreateRoomProps } from './CreateRoomModal';

function CreateGroup({ onClose }: CreateRoomProps) {
  const history = useHistory();
  const [name, setName] = useState('');
  const [{ data: meData }] = useMeQuery();
  const [memberList, setMemberList] = useState([meData?.me!]);
  const { term, setTerm, userList } = useSearchUser();
  const [{ data: suggestedData, fetching: suggesting }] = useAllUsersQuery({
    variables: { limit: 5 },
  });
  const [{ fetching, data }, createGroup] = useCreateRoomMutation();

  useEffect(() => {
    if (data?.createRoom.room) {
      const { room } = data.createRoom;
      history.push(`/room/${room?.id}`);
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const addMemberToList = (u: User) => () => {
    if (u.id === meData?.me.id) return;
    setMemberList((prevList) =>
      prevList.findIndex((lu) => lu.id === u.id) === -1
        ? prevList.concat(u)
        : prevList
    );
  };

  const deleteFromMemberList = (uid: number) => () => {
    if (uid === meData?.me.id) return;
    setMemberList((prevList) => prevList.filter((lu) => lu.id !== uid));
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!name || memberList.length < 1) return;
    try {
      await createGroup({
        name,
        members: memberList.map((m) => m.id),
        type: RoomType.Group,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <CreateRoomLoader creating={fetching} />
      <FormControl mb='2' isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          name='name'
          value={name}
          placeholder='Group name'
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      {memberList.length > 0 && (
        <Box my='2'>
          <Text>Room Members</Text>
          <Wrap border='1px solid lightblue' borderRadius='lg' p='1'>
            {memberList.map((u) => (
              <WrapItem key={`memberlist_${u.id}`}>
                <Badge colorScheme='blue' size='xl'>
                  <Wrap align='center'>
                    <WrapItem>{u.username}</WrapItem>
                    {meData?.me.id !== u.id && (
                      <WrapItem cursor='pointer'>
                        <FaTimes onClick={deleteFromMemberList(u.id)} />
                      </WrapItem>
                    )}
                  </Wrap>
                </Badge>
              </WrapItem>
            ))}
          </Wrap>
        </Box>
      )}
      <Divider my='2' />
      <FormControl mb='2'>
        <FormLabel>Search users</FormLabel>
        {memberList.length < 6 && (
          <InputGroup>
            <InputLeftElement
              pointerEvents='none'
              children={<FaSearch color='gray.300' />}
            />
            <Input
              type='search'
              name='term'
              value={term}
              placeholder='Search for user'
              onChange={(e) => setTerm(e.target.value)}
            />
          </InputGroup>
        )}
      </FormControl>

      {userList.length > 0 && (
        <Box my='3'>
          <Text mb='2'>Search Results</Text>
          <HStack>
            {userList?.map((u) => (
              <Button
                size='sm'
                onClick={addMemberToList(u)}
                key={`search_users-${u.id}`}
              >
                {u.username}
              </Button>
            ))}
          </HStack>
        </Box>
      )}

      <Box my='3'>
        <Text as='h1' fontWeight='bold' mb='2'>
          Suggested Users:
        </Text>
        {suggesting && <CSpinner />}
        <Wrap>
          {suggestedData?.allUsers.nodes.map((u) => (
            <WrapItem key={`group_user_suggest_${u.id}`}>
              <Button size='xs' onClick={addMemberToList(u)}>
                {u.username}
              </Button>
            </WrapItem>
          ))}
        </Wrap>
      </Box>
      <Button
        colorScheme='blue'
        type='submit'
        disabled={memberList.length < 2 || !name}
      >
        Create Group
      </Button>
    </form>
  );
}

export default CreateGroup;
