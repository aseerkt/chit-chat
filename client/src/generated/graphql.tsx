import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
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

export type HandleInviteResult = {
  __typename?: 'HandleInviteResult';
  ok: Scalars['Boolean'];
  accept?: Maybe<Scalars['Boolean']>;
};

export type Invite = {
  __typename?: 'Invite';
  id: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  info: Scalars['String'];
  inviteeId: Scalars['Float'];
  inviterId: Scalars['Float'];
  roomId: Scalars['Float'];
  inviter: User;
  invitee: User;
};

export type LoginInput = {
  username: Scalars['String'];
  password: Scalars['String'];
};

export type Member = {
  __typename?: 'Member';
  role: MemberRole;
  userId: Scalars['Float'];
  roomId: Scalars['Float'];
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
  handleInvitation: HandleInviteResult;
  addMembers: Scalars['Boolean'];
  kickMembers: Scalars['Boolean'];
  sendMessage: SendMessageResponse;
  createRoom: CreateRoomResponse;
  register: UserResponse;
  login: UserResponse;
  testLogin: UserResponse;
  togglePrivacy: Scalars['Boolean'];
};


export type MutationHandleInvitationArgs = {
  accept: Scalars['Boolean'];
  inviteId: Scalars['Int'];
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


export type MutationTestLoginArgs = {
  username: Scalars['String'];
};

export type NewMessagePayload = {
  __typename?: 'NewMessagePayload';
  message: Message;
  participants: Array<Scalars['Float']>;
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
  nodes: Array<Message>;
  hasMore: Scalars['Boolean'];
};

export type PaginatedUsers = {
  __typename?: 'PaginatedUsers';
  nodes: Array<User>;
  hasMore: Scalars['Boolean'];
};

export type Query = {
  __typename?: 'Query';
  getInvites?: Maybe<UserInvites>;
  getMessages: PaginatedMessages;
  getMyRooms: Array<Room>;
  allUsers: PaginatedUsers;
  searchUser?: Maybe<Array<User>>;
  me: User;
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
  getNewMessage: NewMessagePayload;
};

export type User = {
  __typename?: 'User';
  id: Scalars['Int'];
  fullName: Scalars['String'];
  username: Scalars['String'];
  private: Scalars['Boolean'];
  notifications?: Maybe<Array<Notification>>;
};

export type UserInvites = {
  __typename?: 'UserInvites';
  recieved?: Maybe<Array<Invite>>;
  sent?: Maybe<Array<Invite>>;
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
  token?: Maybe<Scalars['String']>;
};

export type MessageFieldsFragment = { __typename?: 'Message', id: number, text: string, senderId: number, roomId: number, createdAt: any, updatedAt: any, sender?: Maybe<{ __typename?: 'User', id: number, fullName: string, username: string, private: boolean }> };

export type NotificationFieldsFragment = { __typename?: 'Notification', recieverId: number };

export type RoomFieldsFragment = { __typename?: 'Room', id: number, name: string, type: RoomType, createdAt: any, updatedAt: any, members: Array<{ __typename?: 'Member', roomId: number, userId: number, role: MemberRole, user: { __typename?: 'User', id: number, fullName: string, username: string, private: boolean } }> };

export type UserFieldFragment = { __typename?: 'User', id: number, fullName: string, username: string, private: boolean };

export type InviteFieldFragment = { __typename?: 'Invite', id: number, info: string, inviteeId: number, inviterId: number, roomId: number };

export type UserInvitesFieldFragment = { __typename?: 'UserInvites', recieved?: Maybe<Array<{ __typename?: 'Invite', id: number, info: string, inviteeId: number, inviterId: number, roomId: number, inviter: { __typename?: 'User', id: number, fullName: string, username: string, private: boolean } }>>, sent?: Maybe<Array<{ __typename?: 'Invite', id: number, info: string, inviteeId: number, inviterId: number, roomId: number, invitee: { __typename?: 'User', id: number, fullName: string, username: string, private: boolean } }>> };

export type UserResponseFragment = { __typename?: 'UserResponse', token?: Maybe<string>, user?: Maybe<{ __typename?: 'User', id: number, fullName: string, username: string, private: boolean }>, errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>> };

export type CreateRoomMutationVariables = Exact<{
  type: RoomType;
  name?: Maybe<Scalars['String']>;
  members: Array<Scalars['Int']> | Scalars['Int'];
}>;


export type CreateRoomMutation = { __typename?: 'Mutation', createRoom: { __typename?: 'CreateRoomResponse', room?: Maybe<{ __typename?: 'Room', id: number, name: string, type: RoomType, createdAt: any, updatedAt: any, members: Array<{ __typename?: 'Member', roomId: number, userId: number, role: MemberRole, user: { __typename?: 'User', id: number, fullName: string, username: string, private: boolean } }> }>, invites?: Maybe<Array<{ __typename?: 'Invite', inviteeId: number, inviterId: number }>>, errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>> } };

export type HandleInvitationMutationVariables = Exact<{
  inviteId: Scalars['Int'];
  accept: Scalars['Boolean'];
}>;


export type HandleInvitationMutation = { __typename?: 'Mutation', handleInvitation: { __typename?: 'HandleInviteResult', ok: boolean, accept?: Maybe<boolean> } };

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

export type TestLoginMutationVariables = Exact<{
  username: Scalars['String'];
}>;


export type TestLoginMutation = { __typename?: 'Mutation', testLogin: { __typename?: 'UserResponse', token?: Maybe<string>, user?: Maybe<{ __typename?: 'User', id: number, fullName: string, username: string, private: boolean }>, errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>> } };

export type TogglePrivacyMutationVariables = Exact<{ [key: string]: never; }>;


export type TogglePrivacyMutation = { __typename?: 'Mutation', togglePrivacy: boolean };

export type AllUsersQueryVariables = Exact<{
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
}>;


export type AllUsersQuery = { __typename?: 'Query', allUsers: { __typename?: 'PaginatedUsers', hasMore: boolean, nodes: Array<{ __typename?: 'User', id: number, fullName: string, username: string, private: boolean }> } };

export type GetInvitesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetInvitesQuery = { __typename?: 'Query', getInvites?: Maybe<{ __typename?: 'UserInvites', recieved?: Maybe<Array<{ __typename?: 'Invite', id: number, info: string, inviteeId: number, inviterId: number, roomId: number, inviter: { __typename?: 'User', id: number, fullName: string, username: string, private: boolean } }>>, sent?: Maybe<Array<{ __typename?: 'Invite', id: number, info: string, inviteeId: number, inviterId: number, roomId: number, invitee: { __typename?: 'User', id: number, fullName: string, username: string, private: boolean } }>> }> };

export type GetMessagesQueryVariables = Exact<{
  roomId: Scalars['Int'];
  limit: Scalars['Int'];
  cursor?: Maybe<Scalars['DateTime']>;
}>;


export type GetMessagesQuery = { __typename?: 'Query', getMessages: { __typename?: 'PaginatedMessages', hasMore: boolean, nodes: Array<{ __typename?: 'Message', id: number, text: string, senderId: number, roomId: number, createdAt: any, updatedAt: any, sender?: Maybe<{ __typename?: 'User', id: number, fullName: string, username: string, private: boolean }> }> } };

export type GetMyRoomsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyRoomsQuery = { __typename?: 'Query', getMyRooms: Array<{ __typename?: 'Room', id: number, name: string, type: RoomType, createdAt: any, updatedAt: any, members: Array<{ __typename?: 'Member', roomId: number, userId: number, role: MemberRole, user: { __typename?: 'User', id: number, fullName: string, username: string, private: boolean } }> }> };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: number, fullName: string, username: string, private: boolean, notifications?: Maybe<Array<{ __typename?: 'Notification', recieverId: number }>> } };

export type SearchUserQueryVariables = Exact<{
  term: Scalars['String'];
}>;


export type SearchUserQuery = { __typename?: 'Query', searchUser?: Maybe<Array<{ __typename?: 'User', id: number, fullName: string, username: string, private: boolean }>> };

export type GetNewMessageSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type GetNewMessageSubscription = { __typename?: 'Subscription', getNewMessage: { __typename?: 'NewMessagePayload', participants: Array<number>, message: { __typename?: 'Message', id: number, text: string, senderId: number, roomId: number, createdAt: any, updatedAt: any, sender?: Maybe<{ __typename?: 'User', id: number, fullName: string, username: string, private: boolean }> } } };

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
    roomId
    userId
    role
    user {
      ...UserField
    }
  }
  createdAt
  updatedAt
}
    ${UserFieldFragmentDoc}`;
export const InviteFieldFragmentDoc = gql`
    fragment InviteField on Invite {
  id
  info
  inviteeId
  inviterId
  roomId
}
    `;
export const UserInvitesFieldFragmentDoc = gql`
    fragment UserInvitesField on UserInvites {
  recieved {
    ...InviteField
    inviter {
      ...UserField
    }
  }
  sent {
    ...InviteField
    invitee {
      ...UserField
    }
  }
}
    ${InviteFieldFragmentDoc}
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

export function useCreateRoomMutation() {
  return Urql.useMutation<CreateRoomMutation, CreateRoomMutationVariables>(CreateRoomDocument);
};
export const HandleInvitationDocument = gql`
    mutation HandleInvitation($inviteId: Int!, $accept: Boolean!) {
  handleInvitation(inviteId: $inviteId, accept: $accept) {
    ok
    accept
  }
}
    `;

export function useHandleInvitationMutation() {
  return Urql.useMutation<HandleInvitationMutation, HandleInvitationMutationVariables>(HandleInvitationDocument);
};
export const LoginDocument = gql`
    mutation Login($loginInput: LoginInput!) {
  login(loginInput: $loginInput) {
    ...UserResponse
  }
}
    ${UserResponseFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const RegisterDocument = gql`
    mutation Register($registerInput: RegisterInput!) {
  register(registerInput: $registerInput) {
    ...UserResponse
  }
}
    ${UserResponseFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
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

export function useSendMessageMutation() {
  return Urql.useMutation<SendMessageMutation, SendMessageMutationVariables>(SendMessageDocument);
};
export const TestLoginDocument = gql`
    mutation TestLogin($username: String!) {
  testLogin(username: $username) {
    ...UserResponse
  }
}
    ${UserResponseFragmentDoc}`;

export function useTestLoginMutation() {
  return Urql.useMutation<TestLoginMutation, TestLoginMutationVariables>(TestLoginDocument);
};
export const TogglePrivacyDocument = gql`
    mutation TogglePrivacy {
  togglePrivacy
}
    `;

export function useTogglePrivacyMutation() {
  return Urql.useMutation<TogglePrivacyMutation, TogglePrivacyMutationVariables>(TogglePrivacyDocument);
};
export const AllUsersDocument = gql`
    query AllUsers($limit: Int, $offset: Int) {
  allUsers(limit: $limit, offset: $offset) {
    nodes {
      ...UserField
    }
    hasMore
  }
}
    ${UserFieldFragmentDoc}`;

export function useAllUsersQuery(options: Omit<Urql.UseQueryArgs<AllUsersQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<AllUsersQuery>({ query: AllUsersDocument, ...options });
};
export const GetInvitesDocument = gql`
    query GetInvites {
  getInvites {
    ...UserInvitesField
  }
}
    ${UserInvitesFieldFragmentDoc}`;

export function useGetInvitesQuery(options: Omit<Urql.UseQueryArgs<GetInvitesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetInvitesQuery>({ query: GetInvitesDocument, ...options });
};
export const GetMessagesDocument = gql`
    query GetMessages($roomId: Int!, $limit: Int!, $cursor: DateTime) {
  getMessages(roomId: $roomId, limit: $limit, cursor: $cursor) {
    nodes {
      ...MessageFields
    }
    hasMore
  }
}
    ${MessageFieldsFragmentDoc}`;

export function useGetMessagesQuery(options: Omit<Urql.UseQueryArgs<GetMessagesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetMessagesQuery>({ query: GetMessagesDocument, ...options });
};
export const GetMyRoomsDocument = gql`
    query GetMyRooms {
  getMyRooms {
    ...RoomFields
  }
}
    ${RoomFieldsFragmentDoc}`;

export function useGetMyRoomsQuery(options: Omit<Urql.UseQueryArgs<GetMyRoomsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetMyRoomsQuery>({ query: GetMyRoomsDocument, ...options });
};
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

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const SearchUserDocument = gql`
    query SearchUser($term: String!) {
  searchUser(term: $term) {
    ...UserField
  }
}
    ${UserFieldFragmentDoc}`;

export function useSearchUserQuery(options: Omit<Urql.UseQueryArgs<SearchUserQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<SearchUserQuery>({ query: SearchUserDocument, ...options });
};
export const GetNewMessageDocument = gql`
    subscription GetNewMessage {
  getNewMessage {
    message {
      ...MessageFields
    }
    participants
  }
}
    ${MessageFieldsFragmentDoc}`;

export function useGetNewMessageSubscription<TData = GetNewMessageSubscription>(options: Omit<Urql.UseSubscriptionArgs<GetNewMessageSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<GetNewMessageSubscription, TData>) {
  return Urql.useSubscription<GetNewMessageSubscription, TData, GetNewMessageSubscriptionVariables>({ query: GetNewMessageDocument, ...options }, handler);
};