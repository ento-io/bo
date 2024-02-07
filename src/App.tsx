import { Provider } from 'react-redux';
import { Suspense } from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './redux/store';
import MuiThemeProvider from './MuiThemeProvider';
import RouterProvider from './routes/RouterProvider';


const App = () => {
  return (
    <Suspense fallback={<span>Loading</span>}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <MuiThemeProvider>
            <RouterProvider store={store} />
          </MuiThemeProvider>
        </PersistGate>
      </Provider>
    </Suspense>
  )
}

export default App
