import {
  Avatar,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Switch,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { FaCog } from 'react-icons/fa';
import {
  MeDocument,
  MeQuery,
  useMeQuery,
  useTogglePrivacyMutation,
} from '../generated/graphql';
import CreateRoomModal from './CreateRoom/CreateRoomModal';

function UserHeader() {
  const { data: meData } = useMeQuery();
  const [togglePrivacy, { loading }] = useTogglePrivacyMutation();

  const changePrivate = () =>
    togglePrivacy({
      update: (cache, { data }) => {
        if (data?.togglePrivacy) {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: {
              me: {
                ...meData!.me!,
                private: !meData?.me.private,
              },
            },
          });
        }
      },
    });

  return (
    <Flex
      p='3'
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
        <WrapItem>
          <Menu placement='bottom-end'>
            <MenuButton
              as={IconButton}
              isRound
              aria-label='notifications'
              icon={<FaCog size='1.4em' />}
            />
            <MenuList>
              <MenuItem closeOnSelect={false}>
                <Switch
                  isChecked={meData?.me?.private || false}
                  disabled={loading}
                  onChange={changePrivate}
                  id='email-alerts'
                />
                <Text ml='2' fontWeight='500'>
                  Private
                </Text>
              </MenuItem>
            </MenuList>
          </Menu>
        </WrapItem>
      </Wrap>
    </Flex>
  );
}

export default UserHeader;
