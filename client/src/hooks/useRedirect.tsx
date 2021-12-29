import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useMeQuery } from '../generated/graphql';

function useRedirect(selector: 'guest' | 'private', reload: boolean = false) {
  const navigate = useNavigate();
  const [{ data, fetching }] = useMeQuery();

  useEffect(() => {
    if (fetching) return;
    switch (selector) {
      case 'guest':
        if (data?.me) {
          if (!reload) navigate('/room/@me', { replace: true });
          else window.location.href = '/';
        }
        break;
      case 'private':
        if (!fetching && !data?.me) {
          navigate('/login', { replace: true });
        }
        break;
    }
  }, [data]);
}

export default useRedirect;
