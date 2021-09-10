import { makeOperation } from '@urql/core';
import { authExchange } from '@urql/exchange-auth';
import { JWT_LOCAL_NAME } from '../constants';

export default authExchange<{ token?: string } | null>({
  addAuthToOperation: ({ authState, operation }) => {
    // the token isn't in the auth state, return the operation without changes
    if (!authState || !authState.token) {
      return operation;
    }

    // fetchOptions can be a function (See Client API) but you can simplify this based on usage
    const fetchOptions =
      typeof operation.context.fetchOptions === 'function'
        ? operation.context.fetchOptions()
        : operation.context.fetchOptions || {};

    return makeOperation(operation.kind, operation, {
      ...operation.context,
      fetchOptions: {
        ...fetchOptions,
        headers: {
          ...fetchOptions.headers,
          Authorization: authState.token,
        },
      },
    });
  },
  getAuth: async ({ authState }) => {
    if (!authState) {
      const token = localStorage.getItem(JWT_LOCAL_NAME);
      if (token) {
        return { token };
      }
      return null;
    }

    return null;
  },
});
