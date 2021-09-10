import { useEffect } from 'react';
import { useState } from 'react';
import { useSearchUserQuery } from '../generated/graphql';
import useDebounce from './useDebounce';

function useSearchUser() {
  const [term, setTerm] = useState('');
  const [{ data, fetching }, searchUser] = useSearchUserQuery({
    pause: true,
  });
  const debouncedSearchTerm = useDebounce(term, 500);

  useEffect(
    () => {
      if (debouncedSearchTerm) {
        searchUser({ variables: { term: debouncedSearchTerm } });
      } else {
        clearSearch();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedSearchTerm] // Only call effect if debounced search term changes
  );

  const clearSearch = () => {
    setTerm('');
  };

  return {
    term,
    setTerm,
    clearSearch,
    userList: data?.searchUser || [],
    searching: fetching,
  };
}

export default useSearchUser;
