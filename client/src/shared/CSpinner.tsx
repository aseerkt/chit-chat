import { Grid, Spinner } from '@chakra-ui/react';

function CSpinner() {
  return (
    <Grid placeItems='center' h='full' w='full'>
      <Spinner
        thickness='4px'
        speed='0.65s'
        emptyColor='gray.200'
        color='blue.500'
        size='xl'
      />
    </Grid>
  );
}

export default CSpinner;
