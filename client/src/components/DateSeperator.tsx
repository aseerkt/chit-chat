import { Badge, Box } from '@chakra-ui/layout';

const DateSeperator: React.FC = ({ children }) => {
  return (
    <Box textAlign='center' my='3'>
      <Badge fontSize='sm' colorScheme='teal'>
        {children}
      </Badge>
    </Box>
  );
};

export default DateSeperator;
