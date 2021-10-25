import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Switch,
  Text,
} from '@chakra-ui/react';
import { FaCog } from 'react-icons/fa';
import { useTogglePrivacyMutation, useMeQuery } from '../../generated/graphql';

function Settings() {
  const [{ data: meData }] = useMeQuery();
  const [{ fetching }, togglePrivacy] = useTogglePrivacyMutation();

  const changePrivate = async () => {
    await togglePrivacy();
  };

  return (
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
  );
}

export default Settings;
