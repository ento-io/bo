import { Provider } from 'react-redux';
import { Suspense } from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { HelmetProvider } from 'react-helmet-async';
import { persistor, store } from './redux/store';
import MuiThemeProvider from './MuiThemeProvider';
import RouterProvider from './routes/RouterProvider';


const App = () => {
  return (
    <Suspense fallback={<span>Loading</span>}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <HelmetProvider>
            <MuiThemeProvider>
              <RouterProvider store={store} />
            </MuiThemeProvider>
          </HelmetProvider>
        </PersistGate>
      </Provider>
    </Suspense>
  )
}

export default App
