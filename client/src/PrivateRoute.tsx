import { Box } from '@chakra-ui/react';
import {
  Redirect,
  Route,
  RouteComponentProps,
  RouteProps,
} from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import { useMeQuery } from './generated/graphql';
import CSpinner from './shared/CSpinner';

type PrivateRouteProps = RouteProps & {
  component: React.FC<RouteComponentProps>;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const { data, loading } = useMeQuery();
  if (loading) {
    return <CSpinner />;
  }
  return (
    <Route
      {...rest}
      render={(props) =>
        data?.me ? (
          <Box h='100vh'>
            <Navbar />
            <Box maxW='7xl' mx='auto' pt='calc( 10vh + 2rem)' pb='5' h='full'>
              <Component {...props} />
            </Box>
          </Box>
        ) : (
          <Redirect
            to={{ pathname: '/login', state: { from: props.location } }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
