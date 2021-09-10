import { cacheExchange } from '@urql/exchange-graphcache';
import { JWT_LOCAL_NAME } from '../constants';
import {
  GetNewMessageSubscription,
  GetNewMessageSubscriptionVariables,
  GetMessagesQuery,
  GetMessagesQueryVariables,
  GetMessagesDocument,
  RegisterMutation,
  MeQuery,
  MeDocument,
  User,
  LoginMutation,
  TogglePrivacyMutation,
} from '../generated/graphql';
import { customPagination } from './utils';

export default cacheExchange({
  keys: {
    Member: (data) => `${data.userId}:${data.roomId}`,
    PaginatedUsers: () => null,
    PaginatedMessages: () => null,
  },
  resolvers: {
    Query: {
      getMessages: customPagination('PaginatedMessages'),
      allUsers: customPagination('PaginatedUsers'),
    },
  },
  updates: {
    Subscription: {
      getNewMessage: (
        result: GetNewMessageSubscription,
        args: GetNewMessageSubscriptionVariables,
        cache
      ) => {
        cache.updateQuery<GetMessagesQuery, GetMessagesQueryVariables>(
          {
            query: GetMessagesDocument,
            variables: { roomId: args.roomId, limit: 20 },
          },
          (data) => {
            if (!data || !result.getNewMessage) return data;
            return {
              getMessages: {
                ...data.getMessages,
                nodes: [result.getNewMessage, ...data.getMessages.nodes],
              },
            };
          }
        );
      },
    },
    Mutation: {
      register: (result: RegisterMutation, args, cache) => {
        const { token, user } = result.register;
        if (!token || !user) return;
        cache.updateQuery<MeQuery>({ query: MeDocument }, () => ({
          me: user as User,
        }));
        localStorage.setItem(JWT_LOCAL_NAME, token);
      },
      login: (result: LoginMutation, _args, cache) => {
        const { token, user } = result.login;
        if (!token || !user) return;
        cache.updateQuery<MeQuery>({ query: MeDocument }, () => ({
          me: user as User,
        }));
        localStorage.setItem(JWT_LOCAL_NAME, token);
      },
      createRoom: (_result, _args, cache) => {
        const allFields = cache.inspectFields('Query');
        const fieldInfos = allFields.filter(
          (info) => info.fieldName === 'getMyRooms'
        );
        fieldInfos.forEach((fi) => {
          cache.invalidate('Query', fi.fieldKey);
        });
      },
      togglePrivacy: (result: TogglePrivacyMutation, _args, cache) => {
        if (!result.togglePrivacy) return;
        cache.updateQuery<MeQuery>({ query: MeDocument }, (data) => ({
          me: { ...data!.me, private: !data!.me.private } as User,
        }));
      },
    },
  },
});
