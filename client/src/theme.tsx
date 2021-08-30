import { extendTheme, ThemeConfig } from '@chakra-ui/react';
import { Styles } from '@chakra-ui/theme-tools';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const styles: Styles = {
  global: {
    /* width */
    '::-webkit-scrollbar': {
      width: '5px',
    },

    /* Track */
    '::-webkit-scrollbar-track': {
      background: '#f1f1f1',
    },

    /* Handle */
    '::-webkit-scrollbar-thumb': {
      background: '#888',
      borderRadius: '999px',
    },

    /* Handle on hover */
    '::-webkit-scrollbar-thumb:hover': {
      background: '#555',
    },
  },
};

export default extendTheme({ config, styles });
