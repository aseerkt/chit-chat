import { Button, IconButton } from '@chakra-ui/button';
import { Image } from '@chakra-ui/image';
import { Flex, Grid, HStack, Text } from '@chakra-ui/layout';
import { FaGithubAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <Grid
      h='100vh'
      maxW='6xl'
      mx='auto'
      p='5'
      align='center'
      gap='5'
      gridTemplateColumns={{ base: '1fr', sm: '1fr 1fr' }}
    >
      <Flex justify='center' align='center'>
        <Image src='/undraw_chat_home.svg' w='80%' objectFit='contain' />
      </Flex>
      <Flex
        direction='column'
        align={{ base: 'center', sm: 'flex-end' }}
        py='10'
        justify='center'
        textAlign={{ base: 'center', sm: 'right' }}
      >
        <Text color='teal' fontSize='5xl' mb='3' fontWeight='bolder'>
          ChitChat
        </Text>
        <Text color='gray' mb='2' fontSize='xl'>
          Any easy way to chat among friends and groups
        </Text>
        <HStack spacing={3}>
          <Link to='/register'>
            <Button size='lg' variant='outline' colorScheme='teal'>
              Register
            </Button>
          </Link>
          <Link to='/login'>
            <Button size='lg' colorScheme='teal'>
              Login
            </Button>
          </Link>
        </HStack>
        <IconButton
          aria-label='source code'
          icon={<FaGithubAlt />}
          as='a'
          mt='3'
          colorScheme='blackAlpha'
          size='lg'
          href='https://github.com/aseerkt/chit-chat'
          target='_blank'
          rel='no-referrer'
          isRound
        />
      </Flex>
    </Grid>
  );
}

export default Home;
