import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Room from './pages/Room';
import PrivateRoute from './PrivateRoute';
import { useMeQuery } from './generated/graphql';
import CSpinner from './shared/CSpinner';
import Home from './pages/Home';

function App() {
  const [{ fetching }] = useMeQuery();

  if (fetching) return <CSpinner />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route
          path='/room/:roomId'
          element={
            <PrivateRoute>
              <Room />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
