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
import { useMeQuery, useTogglePrivacyMutation } from '../generated/graphql';
import CreateRoomModal from './CreateRoom/CreateRoomModal';

function UserHeader() {
  const [{ data: meData }] = useMeQuery();
  const [{ fetching }, togglePrivacy] = useTogglePrivacyMutation();

  const changePrivate = async () => {
    await togglePrivacy();
  };

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
                  disabled={fetching}
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
