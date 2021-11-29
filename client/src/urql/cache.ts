import { Cache, cacheExchange, Variables } from '@urql/exchange-graphcache';
import { JWT_LOCAL_NAME } from '../constants';
import {
  GetNewMessageSubscription,
  GetMessagesQuery,
  GetMessagesQueryVariables,
  GetMessagesDocument,
  MeQuery,
  MeDocument,
  User,
  TogglePrivacyMutation,
  HandleInvitationMutation,
  CreateRoomMutation,
  UserResponse,
} from '../generated/graphql';
import { customPagination } from './customPagination';

function invalidateQueryField(cache: Cache, fieldName: string) {
  const allFields = cache.inspectFields('Query');
  const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
  fieldInfos.forEach((fi) => {
    cache.invalidate('Query', fi.fieldKey);
  });
}

function updateUserCache(field: 'register' | 'login' | 'testLogin') {
  return (result: any, _args: Variables, cache: Cache) => {
    const { token, user } = result[field] as UserResponse;
    if (!token || !user) return;
    cache.updateQuery<MeQuery>({ query: MeDocument }, () => ({
      me: user as User,
    }));
    localStorage.setItem(JWT_LOCAL_NAME, token);
  };
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
      register: updateUserCache('register'),
      login: updateUserCache('login'),
      testLogin: updateUserCache('testLogin'),
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
