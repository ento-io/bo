import { ThemeProvider } from '@mui/material'
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { RouterProvider } from '@tanstack/react-router';
import { GlobalStyles } from './GlobalStyles';
import { theme } from './utils/theme';
import router from './routes/routes';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <EmotionThemeProvider theme={theme}>
        <GlobalStyles theme={theme} />
        <RouterProvider router={router} />
      </EmotionThemeProvider>
    </ThemeProvider>
  )
}

export default App
