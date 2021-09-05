import { useContext, createContext, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { NetworkStatus } from '@apollo/client';
import {
  GetMessagesDocument,
  GetMessagesQuery,
  GetMessagesQueryVariables,
  PaginatedMessages,
  useGetMessagesQuery,
  useGetNewMessageSubscription,
} from '../generated/graphql';

interface MsgCtxType {
  loading: boolean;
  paginatedMessages?: PaginatedMessages;
  fetchMoreMessages: () => void;
  fetchingMore: boolean;
}

const MsgCtx = createContext<MsgCtxType>(null as any);

function MessageProvider({ children }: { children: React.ReactNode }) {
  const { roomId }: any = useParams();
  const {
    data,
    loading,
    variables: getMessagesVariables,
    networkStatus,
    fetchMore,
  } = useGetMessagesQuery({
    variables: { roomId: parseInt({ roomId }.roomId), limit: 8 },
    skip:
      typeof { roomId }.roomId === 'undefined' || { roomId }.roomId === '@me',
    notifyOnNetworkStatusChange: true,
  });

  useGetNewMessageSubscription({
    variables: { roomId: parseInt({ roomId }.roomId) },
    skip:
      typeof { roomId }.roomId === 'undefined' || { roomId }.roomId === '@me',
    onSubscriptionData: ({ client, subscriptionData }) => {
      const newMessage = subscriptionData.data?.getNewMessage;
      console.log(subscriptionData);
      if (newMessage) {
        const queryStuff = {
          query: GetMessagesDocument,
          variables: {
            ...getMessagesVariables!,
            roomId: newMessage.roomId,
          },
        };

        const prevRoomMessages = client.readQuery<
          GetMessagesQuery,
          GetMessagesQueryVariables
        >(queryStuff);

        if (prevRoomMessages) {
          client.writeQuery<GetMessagesQuery, GetMessagesQueryVariables>({
            ...queryStuff,
            data: {
              getMessages: {
                messages: [
                  ...prevRoomMessages.getMessages.messages,
                  newMessage,
                ],
                hasMore: prevRoomMessages.getMessages.hasMore,
              },
            },
          });
        }
      }
    },
  });

  const fetchMoreMessages = useCallback(() => {
    const oldMsgDate = data?.getMessages.messages.reduce((prev, curr) => {
      console.log(prev, curr);
      return prev < curr.createdAt ? prev : curr.createdAt;
    }, new Date());
    console.log({ data, oldMsgDate });
    fetchMore({
      query: GetMessagesDocument,
      variables: {
        ...getMessagesVariables!,
        cursor: oldMsgDate,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, networkStatus]);

  return (
    <MsgCtx.Provider
      value={{
        loading: loading,
        paginatedMessages: data?.getMessages,
        fetchMoreMessages,
        fetchingMore: networkStatus === NetworkStatus.fetchMore,
      }}
    >
      {children}
    </MsgCtx.Provider>
  );
}

export const useCurrentRoomMessagesCtx = () => useContext(MsgCtx);

export default MessageProvider;
