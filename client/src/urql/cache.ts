import { Cache, cacheExchange } from '@urql/exchange-graphcache';
import { JWT_LOCAL_NAME } from '../constants';
import {
  GetNewMessageSubscription,
  GetMessagesQuery,
  GetMessagesQueryVariables,
  GetMessagesDocument,
  RegisterMutation,
  MeQuery,
  MeDocument,
  User,
  LoginMutation,
  TogglePrivacyMutation,
  HandleInvitationMutation,
  CreateRoomMutation,
} from '../generated/graphql';
import { customPagination } from './customPagination';

function invalidateQueryField(cache: Cache, fieldName: string) {
  const allFields = cache.inspectFields('Query');
  const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
  fieldInfos.forEach((fi) => {
    cache.invalidate('Query', fi.fieldKey);
  });
}

export default cacheExchange({
  keys: {
    Member: (data) => `${data.userId}:${data.roomId}`,
    PaginatedUsers: () => null,
    PaginatedMessages: () => null,
    UserInvites: () => null,
  },
  resolvers: {
    Query: {
      getMessages: customPagination('roomId'),
      allUsers: customPagination(),
    },
  },
  updates: {
    Subscription: {
      getNewMessage: (result: GetNewMessageSubscription, _args, cache) => {
        cache.updateQuery<GetMessagesQuery, GetMessagesQueryVariables>(
          {
            query: GetMessagesDocument,
            variables: {
              roomId: result.getNewMessage.message.roomId,
              limit: 20,
            },
          },
          (data) => {
            if (!data || !result.getNewMessage) return data;
            return {
              getMessages: {
                ...data.getMessages,
                nodes: [
                  result.getNewMessage.message,
                  ...data.getMessages.nodes,
                ],
              },
            };
          }
        );
      },
    },
    Mutation: {
      register: (result: RegisterMutation, _args, cache) => {
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
      createRoom: (result: CreateRoomMutation, _args, cache) => {
        if (result.createRoom.room) {
          invalidateQueryField(cache, 'getMyRooms');
          invalidateQueryField(cache, 'getInvites');
        }
      },
      togglePrivacy: (result: TogglePrivacyMutation, _args, cache) => {
        if (!result.togglePrivacy) return;
        cache.updateQuery<MeQuery>({ query: MeDocument }, (data) => ({
          me: { ...data!.me, private: !data!.me.private } as User,
        }));
      },
      handleInvitation: (result: HandleInvitationMutation, _args, cache) => {
        if (result.handleInvitation.ok) {
          invalidateQueryField(cache, 'getMyRooms');
          invalidateQueryField(cache, 'getInvites');
        }
      },
    },
  },
});
