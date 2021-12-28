import { Box, Flex, Text, Wrap, WrapItem } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { BsChatSquareDotsFill } from 'react-icons/bs';
import Invites from './Invites';
import Notifications from './Notifications';
import Settings from './Settings';

function Navbar() {
  return (
    <Box pos='fixed' top='0' w='full' bg='gray.100' h='10vh'>
      <Flex
        maxW='7xl'
        alignItems='center'
        justify='space-between'
        mx='auto'
        h='full'
      >
        <Link to='/'>
          <Flex align='center'>
            <BsChatSquareDotsFill size='1.7em' color='green' />
            <Text ml='2' fontSize='2xl' fontWeight='bolder'>
              Chit<span style={{ color: 'green' }}>Chat</span>
            </Text>
          </Flex>
        </Link>
        <Wrap align='center'>
          {/* TODO: toggle theme */}
          {/* <ToggleTheme /> */}
          <WrapItem>
            <Invites />
          </WrapItem>
          {/* <WrapItem>
            <Notifications />
          </WrapItem> */}
          <WrapItem>
            <Settings />
          </WrapItem>
        </Wrap>
      </Flex>
    </Box>
  );
}

export default Navbar;
