import { IconButton, useColorMode } from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';

export default function ToggleTheme() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <header>
      <IconButton
        aria-label='theme-toggle'
        icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
        onClick={toggleColorMode}
      />
    </header>
  );
}
