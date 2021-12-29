import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Link,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import TestLogin from '../components/TestLogin';
import { useLoginMutation } from '../generated/graphql';
import useRedirect from '../hooks/useRedirect';

function Login() {
  const toast = useToast();
  const [{ fetching }, login] = useLoginMutation();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  useRedirect('guest', true);

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      const res = await login({
        loginInput: formData,
      });
      if (res?.data) {
        const { errors, user, token } = res.data.login;
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
    <Box
      maxW='lg'
      marginX='auto'
      marginTop='1rem'
      border='1px solid lightgray'
      p='6'
    >
      <Text fontWeight='bold' fontSize='2xl' mb='5'>
        Login
      </Text>
      <form onSubmit={onSubmit}>
        <FormControl mb='2' isRequired>
          <FormLabel>Username</FormLabel>
          <Input
            name='username'
            value={formData.username}
            onChange={onChange}
          />
        </FormControl>
        <FormControl mb='2' isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type='password'
            name='password'
            value={formData.password}
            onChange={onChange}
          />
        </FormControl>
        <Button
          isLoading={fetching}
          variant='solid'
          colorScheme='teal'
          my='5'
          type='submit'
        >
          Login
        </Button>
      </form>
      <Divider />
      <Text mt='5'>
        Don't have an account?{' '}
        <Link as={RouterLink} to='/register'>
          Register
        </Link>
      </Text>
      <TestLogin />
    </Box>
  );
}

export default Login;
