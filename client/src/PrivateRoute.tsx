import { Box } from '@chakra-ui/react';
import useRedirect from './hooks/useRedirect';
import Navbar from './components/Navbar/Navbar';
import { PropsWithChildren } from 'react';

const PrivateRoute: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  useRedirect('private');

  return (
    <>
      <Box h='100vh'>
        <Navbar />
        <Box maxW='7xl' mx='auto' pt='calc( 10vh + 2rem)' pb='5' h='full'>
          <>{children}</>{' '}
        </Box>
      </Box>
    </>
  );
};

export default PrivateRoute;
