import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type Base = {
  __typename?: 'Base';
  id: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type CreateRoomResponse = {
  __typename?: 'CreateRoomResponse';
  errors?: Maybe<Array<FieldError>>;
  room?: Maybe<Room>;
  invites?: Maybe<Array<Invite>>;
};


export type DefaultResponse = {
  __typename?: 'DefaultResponse';
  errors?: Maybe<Array<FieldError>>;
  ok: Scalars['Boolean'];
};

export type Errors = {
  __typename?: 'Errors';
  errors?: Maybe<Array<FieldError>>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Invite = {
  __typename?: 'Invite';
  id: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  inviteeId: Scalars['Float'];
  inviterId: Scalars['Float'];
  roomId: Scalars['Float'];
};

export type LoginInput = {
  username: Scalars['String'];
  password: Scalars['String'];
};

export type Member = {
  __typename?: 'Member';
  role: MemberRole;
  userId: Scalars['Float'];
  createdAt: Scalars['DateTime'];
  user: User;
};

/** Specifies member role */
export enum MemberRole {
  Admin = 'ADMIN',
  Member = 'MEMBER',
  Invited = 'INVITED'
}

export type Message = {
  __typename?: 'Message';
  id: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  text: Scalars['String'];
  senderId: Scalars['Float'];
  roomId: Scalars['Float'];
  sender?: Maybe<User>;
};

export type Mutation = {
  __typename?: 'Mutation';
  sendMessage: SendMessageResponse;
  createRoom: CreateRoomResponse;
  register: UserResponse;
  login: UserResponse;
  togglePrivacy: Scalars['Boolean'];
};


export type MutationSendMessageArgs = {
  text: Scalars['String'];
  roomId: Scalars['Int'];
};


export type MutationCreateRoomArgs = {
  type: RoomType;
  members: Array<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
};


export type MutationRegisterArgs = {
  registerInput: RegisterInput;
};


export type MutationLoginArgs = {
  loginInput: LoginInput;
};

export type Notification = {
  __typename?: 'Notification';
  id: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  type: NotificationType;
  text: Scalars['String'];
  recieverId: Scalars['Float'];
  read: Scalars['Boolean'];
  redirectId: Scalars['Float'];
};

/** Type of Notification */
export enum NotificationType {
  RequestDm = 'REQUEST_DM',
  RequestGroup = 'REQUEST_GROUP',
  AcceptDm = 'ACCEPT_DM',
  AcceptGroup = 'ACCEPT_GROUP'
}

export type PaginatedMessages = {
  __typename?: 'PaginatedMessages';
  messages: Array<Message>;
  hasMore: Scalars['Boolean'];
};

export type PaginatedUsers = {
  __typename?: 'PaginatedUsers';
  users: Array<User>;
  hasMore: Scalars['Boolean'];
};

export type Query = {
  __typename?: 'Query';
  getMessages: PaginatedMessages;
  getMyRooms: Array<Room>;
  allUsers: PaginatedUsers;
  searchUser?: Maybe<Array<User>>;
  me: User;
  register: User;
};


export type QueryGetMessagesArgs = {
  cursor?: Maybe<Scalars['DateTime']>;
  limit: Scalars['Int'];
  roomId: Scalars['Int'];
};


export type QueryAllUsersArgs = {
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};


export type QuerySearchUserArgs = {
  term: Scalars['String'];
};


export type QueryRegisterArgs = {
  registerInput: RegisterInput;
};

export type RegisterInput = {
  username: Scalars['String'];
  password: Scalars['String'];
  fullName: Scalars['String'];
};

export type Room = {
  __typename?: 'Room';
  id: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  type: RoomType;
  members: Array<Member>;
  name: Scalars['String'];
};

/** Specifies whether a room is meant direct messaging or group messaging */
export enum RoomType {
  Dm = 'DM',
  Group = 'GROUP'
}

export type SendMessageResponse = {
  __typename?: 'SendMessageResponse';
  errors?: Maybe<Array<FieldError>>;
  message?: Maybe<Message>;
};

export type Subscription = {
  __typename?: 'Subscription';
  getNewMessage: Message;
};


export type SubscriptionGetNewMessageArgs = {
  roomId: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Int'];
  fullName: Scalars['String'];
  username: Scalars['String'];
  private: Scalars['Boolean'];
  notifications?: Maybe<Array<Notification>>;
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
  token?: Maybe<Scalars['String']>;
};

export type MessageFieldsFragment = { __typename?: 'Message', id: number, text: string, senderId: number, roomId: number, createdAt: any, updatedAt: any, sender?: Maybe<{ __typename?: 'User', id: number, fullName: string, username: string, private: boolean }> };

export type NotificationFieldsFragment = { __typename?: 'Notification', recieverId: number };

export type RoomFieldsFragment = { __typename?: 'Room', id: number, name: string, type: RoomType, createdAt: any, updatedAt: any, members: Array<{ __typename?: 'Member', role: MemberRole, user: { __typename?: 'User', id: number, fullName: string, username: string, private: boolean } }> };

export type UserFieldFragment = { __typename?: 'User', id: number, fullName: string, username: string, private: boolean };

export type UserResponseFragment = { __typename?: 'UserResponse', token?: Maybe<string>, user?: Maybe<{ __typename?: 'User', id: number, fullName: string, username: string, private: boolean }>, errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>> };

export type CreateRoomMutationVariables = Exact<{
  type: RoomType;
  name?: Maybe<Scalars['String']>;
  members: Array<Scalars['Int']> | Scalars['Int'];
}>;


export type CreateRoomMutation = { __typename?: 'Mutation', createRoom: { __typename?: 'CreateRoomResponse', room?: Maybe<{ __typename?: 'Room', id: number, name: string, type: RoomType, createdAt: any, updatedAt: any, members: Array<{ __typename?: 'Member', role: MemberRole, user: { __typename?: 'User', id: number, fullName: string, username: string, private: boolean } }> }>, invites?: Maybe<Array<{ __typename?: 'Invite', inviteeId: number, inviterId: number }>>, errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>> } };

export type LoginMutationVariables = Exact<{
  loginInput: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', token?: Maybe<string>, user?: Maybe<{ __typename?: 'User', id: number, fullName: string, username: string, private: boolean }>, errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>> } };

export type RegisterMutationVariables = Exact<{
  registerInput: RegisterInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', token?: Maybe<string>, user?: Maybe<{ __typename?: 'User', id: number, fullName: string, username: string, private: boolean }>, errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>> } };

export type SendMessageMutationVariables = Exact<{
  text: Scalars['String'];
  roomId: Scalars['Int'];
}>;


export type SendMessageMutation = { __typename?: 'Mutation', sendMessage: { __typename?: 'SendMessageResponse', message?: Maybe<{ __typename?: 'Message', id: number, text: string, senderId: number, roomId: number, createdAt: any, updatedAt: any, sender?: Maybe<{ __typename?: 'User', id: number, fullName: string, username: string, private: boolean }> }>, errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>> } };

export type TogglePrivacyMutationVariables = Exact<{ [key: string]: never; }>;


export type TogglePrivacyMutation = { __typename?: 'Mutation', togglePrivacy: boolean };

export type AllUsersQueryVariables = Exact<{
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
}>;


export type AllUsersQuery = { __typename?: 'Query', allUsers: { __typename?: 'PaginatedUsers', hasMore: boolean, users: Array<{ __typename?: 'User', id: number, fullName: string, username: string, private: boolean }> } };

export type GetMessagesQueryVariables = Exact<{
  roomId: Scalars['Int'];
  limit: Scalars['Int'];
  cursor?: Maybe<Scalars['DateTime']>;
}>;


export type GetMessagesQuery = { __typename?: 'Query', getMessages: { __typename?: 'PaginatedMessages', hasMore: boolean, messages: Array<{ __typename?: 'Message', id: number, text: string, senderId: number, roomId: number, createdAt: any, updatedAt: any, sender?: Maybe<{ __typename?: 'User', id: number, fullName: string, username: string, private: boolean }> }> } };

export type GetMyRoomsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyRoomsQuery = { __typename?: 'Query', getMyRooms: Array<{ __typename?: 'Room', id: number, name: string, type: RoomType, createdAt: any, updatedAt: any, members: Array<{ __typename?: 'Member', role: MemberRole, user: { __typename?: 'User', id: number, fullName: string, username: string, private: boolean } }> }> };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: number, fullName: string, username: string, private: boolean, notifications?: Maybe<Array<{ __typename?: 'Notification', recieverId: number }>> } };

export type SearchUserQueryVariables = Exact<{
  term: Scalars['String'];
}>;


export type SearchUserQuery = { __typename?: 'Query', searchUser?: Maybe<Array<{ __typename?: 'User', id: number, fullName: string, username: string, private: boolean }>> };

export type GetNewMessageSubscriptionVariables = Exact<{
  roomId: Scalars['Int'];
}>;


export type GetNewMessageSubscription = { __typename?: 'Subscription', getNewMessage: { __typename?: 'Message', id: number, text: string, senderId: number, roomId: number, createdAt: any, updatedAt: any, sender?: Maybe<{ __typename?: 'User', id: number, fullName: string, username: string, private: boolean }> } };

export const UserFieldFragmentDoc = gql`
    fragment UserField on User {
  id
  fullName
  username
  private
}
    `;
export const MessageFieldsFragmentDoc = gql`
    fragment MessageFields on Message {
  id
  text
  senderId
  sender {
    ...UserField
  }
  roomId
  createdAt
  updatedAt
}
    ${UserFieldFragmentDoc}`;
export const NotificationFieldsFragmentDoc = gql`
    fragment NotificationFields on Notification {
  recieverId
}
    `;
export const RoomFieldsFragmentDoc = gql`
    fragment RoomFields on Room {
  id
  name
  type
  members {
    role
    user {
      ...UserField
    }
  }
  createdAt
  updatedAt
}
    ${UserFieldFragmentDoc}`;
export const UserResponseFragmentDoc = gql`
    fragment UserResponse on UserResponse {
  user {
    ...UserField
  }
  token
  errors {
    field
    message
  }
}
    ${UserFieldFragmentDoc}`;
export const CreateRoomDocument = gql`
    mutation CreateRoom($type: RoomType!, $name: String, $members: [Int!]!) {
  createRoom(type: $type, name: $name, members: $members) {
    room {
      ...RoomFields
    }
    invites {
      inviteeId
      inviterId
    }
    errors {
      field
      message
    }
  }
}
    ${RoomFieldsFragmentDoc}`;
export type CreateRoomMutationFn = Apollo.MutationFunction<CreateRoomMutation, CreateRoomMutationVariables>;

/**
 * __useCreateRoomMutation__
 *
 * To run a mutation, you first call `useCreateRoomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRoomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRoomMutation, { data, loading, error }] = useCreateRoomMutation({
 *   variables: {
 *      type: // value for 'type'
 *      name: // value for 'name'
 *      members: // value for 'members'
 *   },
 * });
 */
export function useCreateRoomMutation(baseOptions?: Apollo.MutationHookOptions<CreateRoomMutation, CreateRoomMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateRoomMutation, CreateRoomMutationVariables>(CreateRoomDocument, options);
      }
export type CreateRoomMutationHookResult = ReturnType<typeof useCreateRoomMutation>;
export type CreateRoomMutationResult = Apollo.MutationResult<CreateRoomMutation>;
export type CreateRoomMutationOptions = Apollo.BaseMutationOptions<CreateRoomMutation, CreateRoomMutationVariables>;
export const LoginDocument = gql`
    mutation Login($loginInput: LoginInput!) {
  login(loginInput: $loginInput) {
    ...UserResponse
  }
}
    ${UserResponseFragmentDoc}`;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      loginInput: // value for 'loginInput'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($registerInput: RegisterInput!) {
  register(registerInput: $registerInput) {
    ...UserResponse
  }
}
    ${UserResponseFragmentDoc}`;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      registerInput: // value for 'registerInput'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const SendMessageDocument = gql`
    mutation SendMessage($text: String!, $roomId: Int!) {
  sendMessage(text: $text, roomId: $roomId) {
    message {
      ...MessageFields
    }
    errors {
      field
      message
    }
  }
}
    ${MessageFieldsFragmentDoc}`;
export type SendMessageMutationFn = Apollo.MutationFunction<SendMessageMutation, SendMessageMutationVariables>;

/**
 * __useSendMessageMutation__
 *
 * To run a mutation, you first call `useSendMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendMessageMutation, { data, loading, error }] = useSendMessageMutation({
 *   variables: {
 *      text: // value for 'text'
 *      roomId: // value for 'roomId'
 *   },
 * });
 */
export function useSendMessageMutation(baseOptions?: Apollo.MutationHookOptions<SendMessageMutation, SendMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendMessageMutation, SendMessageMutationVariables>(SendMessageDocument, options);
      }
export type SendMessageMutationHookResult = ReturnType<typeof useSendMessageMutation>;
export type SendMessageMutationResult = Apollo.MutationResult<SendMessageMutation>;
export type SendMessageMutationOptions = Apollo.BaseMutationOptions<SendMessageMutation, SendMessageMutationVariables>;
export const TogglePrivacyDocument = gql`
    mutation TogglePrivacy {
  togglePrivacy
}
    `;
export type TogglePrivacyMutationFn = Apollo.MutationFunction<TogglePrivacyMutation, TogglePrivacyMutationVariables>;

/**
 * __useTogglePrivacyMutation__
 *
 * To run a mutation, you first call `useTogglePrivacyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTogglePrivacyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [togglePrivacyMutation, { data, loading, error }] = useTogglePrivacyMutation({
 *   variables: {
 *   },
 * });
 */
export function useTogglePrivacyMutation(baseOptions?: Apollo.MutationHookOptions<TogglePrivacyMutation, TogglePrivacyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<TogglePrivacyMutation, TogglePrivacyMutationVariables>(TogglePrivacyDocument, options);
      }
export type TogglePrivacyMutationHookResult = ReturnType<typeof useTogglePrivacyMutation>;
export type TogglePrivacyMutationResult = Apollo.MutationResult<TogglePrivacyMutation>;
export type TogglePrivacyMutationOptions = Apollo.BaseMutationOptions<TogglePrivacyMutation, TogglePrivacyMutationVariables>;
export const AllUsersDocument = gql`
    query AllUsers($limit: Int, $offset: Int) {
  allUsers(limit: $limit, offset: $offset) {
    users {
      ...UserField
    }
    hasMore
  }
}
    ${UserFieldFragmentDoc}`;

/**
 * __useAllUsersQuery__
 *
 * To run a query within a React component, call `useAllUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllUsersQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useAllUsersQuery(baseOptions?: Apollo.QueryHookOptions<AllUsersQuery, AllUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllUsersQuery, AllUsersQueryVariables>(AllUsersDocument, options);
      }
export function useAllUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllUsersQuery, AllUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllUsersQuery, AllUsersQueryVariables>(AllUsersDocument, options);
        }
export type AllUsersQueryHookResult = ReturnType<typeof useAllUsersQuery>;
export type AllUsersLazyQueryHookResult = ReturnType<typeof useAllUsersLazyQuery>;
export type AllUsersQueryResult = Apollo.QueryResult<AllUsersQuery, AllUsersQueryVariables>;
export const GetMessagesDocument = gql`
    query GetMessages($roomId: Int!, $limit: Int!, $cursor: DateTime) {
  getMessages(roomId: $roomId, limit: $limit, cursor: $cursor) {
    messages {
      ...MessageFields
    }
    hasMore
  }
}
    ${MessageFieldsFragmentDoc}`;

/**
 * __useGetMessagesQuery__
 *
 * To run a query within a React component, call `useGetMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMessagesQuery({
 *   variables: {
 *      roomId: // value for 'roomId'
 *      limit: // value for 'limit'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useGetMessagesQuery(baseOptions: Apollo.QueryHookOptions<GetMessagesQuery, GetMessagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMessagesQuery, GetMessagesQueryVariables>(GetMessagesDocument, options);
      }
export function useGetMessagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMessagesQuery, GetMessagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMessagesQuery, GetMessagesQueryVariables>(GetMessagesDocument, options);
        }
export type GetMessagesQueryHookResult = ReturnType<typeof useGetMessagesQuery>;
export type GetMessagesLazyQueryHookResult = ReturnType<typeof useGetMessagesLazyQuery>;
export type GetMessagesQueryResult = Apollo.QueryResult<GetMessagesQuery, GetMessagesQueryVariables>;
export const GetMyRoomsDocument = gql`
    query GetMyRooms {
  getMyRooms {
    ...RoomFields
  }
}
    ${RoomFieldsFragmentDoc}`;

/**
 * __useGetMyRoomsQuery__
 *
 * To run a query within a React component, call `useGetMyRoomsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyRoomsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyRoomsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMyRoomsQuery(baseOptions?: Apollo.QueryHookOptions<GetMyRoomsQuery, GetMyRoomsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyRoomsQuery, GetMyRoomsQueryVariables>(GetMyRoomsDocument, options);
      }
export function useGetMyRoomsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyRoomsQuery, GetMyRoomsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyRoomsQuery, GetMyRoomsQueryVariables>(GetMyRoomsDocument, options);
        }
export type GetMyRoomsQueryHookResult = ReturnType<typeof useGetMyRoomsQuery>;
export type GetMyRoomsLazyQueryHookResult = ReturnType<typeof useGetMyRoomsLazyQuery>;
export type GetMyRoomsQueryResult = Apollo.QueryResult<GetMyRoomsQuery, GetMyRoomsQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    ...UserField
    notifications {
      ...NotificationFields
    }
  }
}
    ${UserFieldFragmentDoc}
${NotificationFieldsFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const SearchUserDocument = gql`
    query SearchUser($term: String!) {
  searchUser(term: $term) {
    ...UserField
  }
}
    ${UserFieldFragmentDoc}`;

/**
 * __useSearchUserQuery__
 *
 * To run a query within a React component, call `useSearchUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchUserQuery({
 *   variables: {
 *      term: // value for 'term'
 *   },
 * });
 */
export function useSearchUserQuery(baseOptions: Apollo.QueryHookOptions<SearchUserQuery, SearchUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchUserQuery, SearchUserQueryVariables>(SearchUserDocument, options);
      }
export function useSearchUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchUserQuery, SearchUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchUserQuery, SearchUserQueryVariables>(SearchUserDocument, options);
        }
export type SearchUserQueryHookResult = ReturnType<typeof useSearchUserQuery>;
export type SearchUserLazyQueryHookResult = ReturnType<typeof useSearchUserLazyQuery>;
export type SearchUserQueryResult = Apollo.QueryResult<SearchUserQuery, SearchUserQueryVariables>;
export const GetNewMessageDocument = gql`
    subscription GetNewMessage($roomId: Int!) {
  getNewMessage(roomId: $roomId) {
    ...MessageFields
  }
}
    ${MessageFieldsFragmentDoc}`;

/**
 * __useGetNewMessageSubscription__
 *
 * To run a query within a React component, call `useGetNewMessageSubscription` and pass it any options that fit your needs.
 * When your component renders, `useGetNewMessageSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNewMessageSubscription({
 *   variables: {
 *      roomId: // value for 'roomId'
 *   },
 * });
 */
export function useGetNewMessageSubscription(baseOptions: Apollo.SubscriptionHookOptions<GetNewMessageSubscription, GetNewMessageSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<GetNewMessageSubscription, GetNewMessageSubscriptionVariables>(GetNewMessageDocument, options);
      }
export type GetNewMessageSubscriptionHookResult = ReturnType<typeof useGetNewMessageSubscription>;
export type GetNewMessageSubscriptionResult = Apollo.SubscriptionResult<GetNewMessageSubscription>;