import { useHistory } from 'react-router';
import { useEffect } from 'react';
import { useMeQuery } from '../generated/graphql';

function usePublicRedirect(SSRedirect: boolean = false) {
  const [{ data }] = useMeQuery();
  const history = useHistory();
  useEffect(() => {
    if (data?.me) {
      if (SSRedirect) window.location.href = '/room/@me';
      else history.push('/room/@me');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
}

export default usePublicRedirect;
