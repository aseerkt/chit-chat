import { useState, useEffect } from 'react';
import { useClient } from 'urql';
import {
  SearchUserDocument,
  SearchUserQuery,
  SearchUserQueryVariables,
  User,
} from '../generated/graphql';
import useDebounce from './useDebounce';

function useSearchUser() {
  const [term, setTerm] = useState('');
  const [userList, setUserList] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(term, 500);
  const client = useClient();

  useEffect(
    () => {
      if (debouncedSearchTerm) {
        setSearching(true);
        client
          .query<SearchUserQuery, SearchUserQueryVariables>(
            SearchUserDocument,
            {
              term: debouncedSearchTerm,
            }
          )
          .toPromise()
          .then((res) => {
            setUserList(res.data?.searchUser || []);
            setSearching(false);
          });
      } else {
        clearSearch();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedSearchTerm] // Only call effect if debounced search term changes
  );

  const clearSearch = () => {
    setTerm('');
    setUserList([]);
  };

  return {
    term,
    setTerm,
    clearSearch,
    userList,
    searching,
  };
}

export default useSearchUser;
