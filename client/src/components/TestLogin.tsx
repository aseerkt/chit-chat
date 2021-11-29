import { Button, ButtonGroup, useToast } from '@chakra-ui/react';
import { useTestLoginMutation } from '../generated/graphql';

function TestLogin() {
  const [{ fetching }, testLogin] = useTestLoginMutation();
  const toast = useToast();

  const onClick: (
    username: 'bob' | 'harry'
  ) => React.MouseEventHandler<HTMLButtonElement> = (username) => async (e) => {
    e.preventDefault();
    try {
      const res = await testLogin({
        username,
      });
      if (res?.data) {
        const { errors, user, token } = res.data.testLogin;
        if (user && token) {
          toast({
            id: 'Login',
            title: 'Login success',
            description: `Welcome ${user.fullName}`,
            duration: 2000,
            isClosable: true,
            status: 'success',
          });
        }
        if (errors)
          errors.forEach(({ field, message }) =>
            toast({
              id: field,
              title: field,
              description: message,
              duration: 1000,
              status: 'error',
            })
          );
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <ButtonGroup mt='5'>
      <Button isLoading={fetching} onClick={onClick('bob')} colorScheme='teal'>
        Login as Bob
      </Button>
      <Button
        isLoading={fetching}
        onClick={onClick('harry')}
        colorScheme='teal'
      >
        Login as Harry
      </Button>
    </ButtonGroup>
  );
}

export default TestLogin;
