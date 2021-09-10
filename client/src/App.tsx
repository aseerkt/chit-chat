import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Room from './pages/Room';
import PrivateRoute from './PrivateRoute';
import { useMeQuery } from './generated/graphql';
import CSpinner from './shared/CSpinner';
import Home from './pages/Home';

function App() {
  const [{ data, fetching }] = useMeQuery();

  if (fetching) return <CSpinner />;

  return (
    <BrowserRouter>
      <Switch>
        <Route
          exact
          path='/'
          render={() => (data?.me ? <Redirect to='/room/@me' /> : <Home />)}
        />
        <Route exact path='/login' component={Login} />
        <Route exact path='/register' component={Register} />
        <PrivateRoute exact path='/room/:roomId' component={Room} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
