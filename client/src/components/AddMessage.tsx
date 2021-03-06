import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Flex, FormControl, Input } from '@chakra-ui/react';
import { RoomType, useSendMessageMutation } from '../generated/graphql';
import { useCurrentRoomCtx } from '../context/RoomContext';
import { useScrollCtx } from '../context/MessageScrollCtx';

function AddMessage() {
  const params: any = useParams();
  const { room } = useCurrentRoomCtx();
  const { scrollToBottom } = useScrollCtx();
  const [{ fetching }, sendMsg] = useSendMessageMutation();
  const [text, setText] = useState('');

  const sendMessage: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      const res = await sendMsg({ roomId: parseInt(params.roomId), text });
      if (res?.data?.sendMessage?.message) {
        setText('');
        scrollToBottom();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (params.roomId.includes('@')) return null;

  return (
    <form
      style={{ width: '100%', height: 'max-content' }}
      onSubmit={sendMessage}
    >
      <Flex w='full' align='center' h='12' borderTop='1px solid lightgray'>
        <FormControl>
          <Input
            p='3'
            h='full'
            variant='unstyled'
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={!params.roomId || params.roomId === '@me'}
            _disabled={{ cursor: 'not-allowed' }}
            placeholder={` Send message to ${
              room?.type === RoomType.Dm ? '@' : '#'
            }${room?.name}`}
          />
        </FormControl>
        <Button
          colorScheme='blue'
          disabled={!text}
          isLoading={fetching}
          type='submit'
          h='full'
        >
          Send
        </Button>
      </Flex>
    </form>
  );
}

export default AddMessage;
