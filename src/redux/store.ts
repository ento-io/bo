import { persistStore, persistCombineReducers } from 'redux-persist';

import storage from 'redux-persist/lib/storage';
import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';

import appReducer from './reducers/app.reducer';
import categoryReducer from './reducers/category.reducer';
import roleReducer from './reducers/role.reducer';
import settingsReducer from './reducers/settings.reducer';
import userReducer from './reducers/user.reducer';
import articleReducer from './reducers/article.reducer';
import estimateReducer from './reducers/estimate.reducer';
import invoiceReducer from './reducers/invoice.reducer';

const reducers = {
  app: appReducer,
  category: categoryReducer,
  user: userReducer,
  article: articleReducer,
  settings: settingsReducer,
  role: roleReducer,
  estimate: estimateReducer,
  invoice: invoiceReducer,
};

const persistConfig = {
  key: 'root',
  storage,
  // There is an issue in the source code of redux-persist (default setTimeout does not cleaning)
  timeout: undefined,
  whitelist: ['settings'],
};

export const persistedRootReducer = persistCombineReducers(persistConfig, reducers);

interface Arg {
  initialState?: any;
}

const createStore = ({ initialState }: Arg = {}) => {
  const store = configureStore({
    preloadedState: initialState,
    reducer: persistedRootReducer,
    middleware: (getDefaultMiddleware: any) =>
      getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
      }),
    devTools: process.env.NODE_ENV !== 'production',
  });

  return store;
};

const store = createStore();

const persistor = persistStore(store, null);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof store.getState>;

export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;
export type AppThunkAction = (dispatch: AppDispatch, getState?: () => RootState) => Promise<void>;

export type Store = ReturnType<typeof createStore>;
export { store, persistor };
