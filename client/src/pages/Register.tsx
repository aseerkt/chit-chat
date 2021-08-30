import { useState } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
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
import { MeDocument, useRegisterMutation } from '../generated/graphql';
import { JWT_LOCAL_NAME } from '../constants';

function Register() {
  const toast = useToast();
  const history = useHistory();
  const [register, { loading }] = useRegisterMutation();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
  });

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      await register({
        variables: { registerInput: formData },
        update: (cache, { data }) => {
          if (data) {
            const { errors, user, token } = data.register;
            if (user && token) {
              cache.writeQuery({ query: MeDocument, data: { me: user } });
              localStorage.setItem(JWT_LOCAL_NAME, token);
              toast({
                id: 'Register',
                title: 'Register success',
                description: `Welcome ${user.fullName}`,
                duration: 2000,
                isClosable: true,
                status: 'success',
              });
              history.push('/');
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
        },
      });
    } catch (err) {}
  };

  return (
    <Box
      maxW='lg'
      marginX='auto'
      marginTop='1rem'
      border='1px solid lightgray'
      p='5'
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
          isLoading={loading}
          variant='solid'
          colorScheme='teal'
          my='5'
          type='submit'
        >
          Register
        </Button>
      </form>
      <Divider />
      <Link mt='5' as={RouterLink} to='/login'>
        Login
      </Link>
    </Box>
  );
}

export default Register;
