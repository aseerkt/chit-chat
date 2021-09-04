import { Flex, Button, Avatar, IconButton } from '@chakra-ui/react';
import { FaPlusCircle } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import {
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
  const { data: meData } = useMeQuery();
  const { data, loading, fetchMore, variables } = useAllUsersQuery({
    variables: { limit: 5 },
  });
  const [createDMRoom, { loading: creating }] = useCreateRoomMutation();

  return (
    <Flex direction='column'>
      <CreateRoomLoader creating={creating} />
      {loading && <CSpinner />}
      {data?.allUsers.users.map((u) => (
        <Button
          key={`_suggest_${u.id}`}
          onClick={async () => {
            await createDMRoom({
              variables: {
                type: RoomType.Dm,
                members: [u.id, meData?.me.id!],
              },
              update: (cache, { data }) => {
                if (data?.createRoom.room) {
                  cache.evict({ fieldName: 'getMyRooms' });
                  history.push(`/room/${data.createRoom.room.id}`);
                  onClose();
                }
              },
            });
          }}
          size='lg'
          justifyContent='flex-start'
          py='2'
          my='1'
        >
          <Avatar
            size='sm'
            name={u.fullName}
            src='https://bit.ly/tioluwani-kolawole'
            mr='2'
          />
          <strong>{u.username}</strong>
        </Button>
      ))}
      {data?.allUsers.hasMore && (
        <IconButton
          onClick={() => {
            fetchMore({
              variables: {
                limit: variables?.limit,
                offset: data.allUsers.users.length,
              },
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
