import { IconButton } from '@chakra-ui/button';
import { HStack } from '@chakra-ui/layout';
import { useToast } from '@chakra-ui/toast';
import { useEffect } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useHandleInvitationMutation } from '../../generated/graphql';

type InterfaceActionProps = { inviteId: number };

const InviteAction: React.FC<InterfaceActionProps> = ({ inviteId }) => {
  const toast = useToast();
  const [{ fetching, data }, handleInvite] = useHandleInvitationMutation();

  useEffect(() => {
    if (data) {
      toast({
        status: data.handleInvitation.ok ? 'success' : 'error',
        title: data.handleInvitation.ok
          ? `Invitation ${
              data.handleInvitation.accept ? 'accepted' : 'ignored'
            }`
          : 'Invitation handle failed',
        duration: 1000,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <HStack spacing='2' align='center' ml='auto'>
      <IconButton
        size='sm'
        colorScheme='teal'
        title='Accept Invitation'
        aria-label='accept'
        icon={<FaCheck />}
        isLoading={fetching}
        onClick={() => handleInvite({ inviteId, accept: true })}
      />
      <IconButton
        size='sm'
        title='Ignore'
        aria-label='ignore'
        icon={<FaTimes />}
        isLoading={fetching}
        onClick={() => handleInvite({ inviteId, accept: false })}
      />
    </HStack>
  );
};

export default InviteAction;
