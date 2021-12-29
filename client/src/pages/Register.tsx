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
import { useRegisterMutation } from '../generated/graphql';
import useRedirect from '../hooks/useRedirect';

function Register() {
  const toast = useToast();
  const [{ fetching }, register] = useRegisterMutation();
  const [formData, setFormData] = useState({
    fullName: '',
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
      const res = await register({
        registerInput: formData,
      });
      if (res?.data) {
        const { errors, user, token } = res?.data.register;
        if (user && token) {
          toast({
            id: 'Register',
            title: 'Register success',
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
    } catch (err) {}
  };

  return (
    <Box
      maxW='lg'
      marginX='auto'
      marginTop='1rem'
      border='1px solid lightgray'
      p='6'
    >
      <Text as='h1' fontWeight='bold' fontSize='2xl' mb='5'>
        Register
      </Text>
      <form onSubmit={onSubmit}>
        <FormControl mb='2' isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            name='fullName'
            value={formData.fullName}
            onChange={onChange}
          />
        </FormControl>
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
          Register
        </Button>
      </form>
      <Divider />
      <Text mt='5'>
        Already have an account?{' '}
        <Link as={RouterLink} to='/login'>
          Login
        </Link>
      </Text>
    </Box>
  );
}

export default Register;
