import { IconButton, Menu, MenuButton } from '@chakra-ui/react';
import { FaRegBell } from 'react-icons/fa';

function Notifications() {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label='notifications'
        icon={<FaRegBell size='1.4em' />}
      >
        Notifs
      </MenuButton>
    </Menu>
  );
}

export default Notifications;
