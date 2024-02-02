import { ThemeProvider } from '@mui/material'
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { Provider } from 'react-redux'
import { GlobalStyles } from './GlobalStyles';
import { theme } from './utils/theme.utils';
import Routes from './Routes';
import { store } from './redux/store'

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <EmotionThemeProvider theme={theme}>
          <GlobalStyles theme={theme} />
          <Routes />
        </EmotionThemeProvider>
      </ThemeProvider>
    </Provider>
  )
}

export default App
