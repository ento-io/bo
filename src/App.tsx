import { ThemeProvider } from '@mui/material'
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { GlobalStyles } from './GlobalStyles';
import { theme } from './utils/theme';
import Routes from './Routes';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <EmotionThemeProvider theme={theme}>
        <GlobalStyles theme={theme} />
        <Routes />
      </EmotionThemeProvider>
    </ThemeProvider>
  )
}

export default App
