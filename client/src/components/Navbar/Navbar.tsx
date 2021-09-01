import { Box, Flex, Menu, MenuButton, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

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
          <Text fontSize='2xl' fontWeight='bolder'>
            Apollo DM
          </Text>
        </Link>
        <Flex align='center'>
          {/* TODO: toggle theme */}
          {/* <ToggleTheme /> */}
          <Menu>
            <MenuButton as={Text}>Notifs</MenuButton>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
}

export default Navbar;
