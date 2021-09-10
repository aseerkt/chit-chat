import { Flex, Button, Avatar, IconButton } from '@chakra-ui/react';
import { FaPlusCircle } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  AllUsersQueryVariables,
  RoomType,
  useAllUsersQuery,
  useCreateRoomMutation,
  useMeQuery,
} from '../../generated/graphql';
import CSpinner from '../../shared/CSpinner';
import CreateRoomLoader from './CreateRoomLoader';
import { CreateRoomProps } from './CreateRoomModal';

function CreateDM({ onClose }: CreateRoomProps) {
  const history = useHistory();
  const [variables, setVariables] = useState<AllUsersQueryVariables>({
    limit: 5,
  });
  const [{ data: meData }] = useMeQuery();
  const [{ data, fetching }] = useAllUsersQuery({
    variables: { limit: 5 },
  });
  const [{ fetching: creating, data: createRoomResponse }, createDMRoom] =
    useCreateRoomMutation();

  useEffect(() => {
    if (createRoomResponse?.createRoom.room) {
      history.push(`/room/${createRoomResponse.createRoom.room.id}`);
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createRoomResponse]);

  return (
    <Flex direction='column'>
      <CreateRoomLoader creating={creating} />
      {fetching && <CSpinner />}
      {data?.allUsers.nodes.map((u) => (
        <Button
          key={`_suggest_${u.id}`}
          onClick={async () => {
            await createDMRoom({
              type: RoomType.Dm,
              members: [u.id, meData?.me.id!],
            });
          }}
          size='lg'
          justifyContent='flex-start'
          py='2'
          my='1'
        >
          <Avatar size='sm' name={u.fullName} mr='2' />
          <strong>{u.username}</strong>
        </Button>
      ))}
      {data?.allUsers.hasMore && (
        <IconButton
          onClick={() => {
            setVariables({
              limit: variables.limit,
              offset: data.allUsers.nodes.length,
            });
          }}
          aria-label='load-more'
          icon={<FaPlusCircle />}
        />
      )}
    </Flex>
  );
}

export default CreateDM;
