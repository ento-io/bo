import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAlert, IAppState } from '@/types/app.type';
import { IUser } from '@/types/user.type';

const initialState: IAppState = {
  notifications: {},
  loading: false,
  currentUser: null,
  accountEmail: '',
  error: '',
  message: '',
  infoMessage: '',
  pageTitle: '',
  alert: null,
  appSnackBar: { open: false, type: '', message: '', duration: 0 },
};

export const app: any = createSlice({
  name: 'app',
  initialState,
  reducers: {
    startLoadingSlice: (state: IAppState) => {
      state.loading = true;
    },
    endLoadingSlice: (state: IAppState) => {
      state.loading = false;
    },
    loadCurrentUserSlice: (state: IAppState, action: PayloadAction<IUser>) => {
      state.currentUser = action.payload;
    },
    setAppPageTitleSlice: (state: IAppState, action: PayloadAction<string>) => {
      state.pageTitle = action.payload;
    },
    clearCurrentUserSlice: (state: IAppState) => {
      state.currentUser = null;
    },
    setNotificationsSlice: (state: IAppState, action: PayloadAction<Record<string, number>>) => {
      state.notifications = {
        ...state.notifications,
        ...action.payload,
      };
    },
    setAccountEmailSlice: (state: IAppState, action: PayloadAction<string>) => {
      state.accountEmail = action.payload;
    },
    clearAccountEmailSlice: (state: IAppState) => {
      state.accountEmail = '';
    },
    setAlertSlice: (state: IAppState, action: PayloadAction<IAlert>) => {
      state.alert = action.payload;
    },
    clearAlertSlice: (state: IAppState) => {
      state.alert = null;
    },
    setErrorSlice: (state: IAppState, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setMessageSlice: (state: IAppState, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
    setInfoMessageSlice: (state: IAppState, action: PayloadAction<string>) => {
      state.infoMessage = action.payload;
    },
    closeErrorSlice: (state: IAppState) => {
      state.error = '';
    },
    closeMessageSlice: (state: IAppState) => {
      state.message = '';
    },
    clearInfoMessageSlice: (state: IAppState) => {
      state.infoMessage = '';
    },
  },
});

export const {
  startLoadingSlice,
  endLoadingSlice,
  setErrorSlice,
  closeErrorSlice,
  closeMessageSlice,
  setMessageSlice,
  clearCurrentUserSlice,
  loadCurrentUserSlice,
  loadCurrentUserImageSlice,
  setAppPageTitleSlice,
  setNotificationsSlice,
  setAccountEmailSlice,
  clearAccountEmailSlice,
  setAlertSlice,
  clearAlertSlice,
  setInfoMessageSlice,
  clearInfoMessageSlice,
} = app.actions;

// ---------------------------------------------- //
// ------------------ SELECTOR ------------------ //
// ---------------------------------------------- //
// NOTE: do not use RootState as state type to avoid import circular dependencies (from store.ts)
// we can not commit to git if there is circular dependencies
export const getAppSelector = (state: Record<string, any>): IAppState => state.app;
export const getAppLoadingSelector = (state: Record<string, any>): boolean => state.app.loading;
export const getAppErrorSelector = (state: Record<string, any>): string => state.app.error;
export const getAppMessageSelector = (state: Record<string, any>): string => state.app.message;
export const getAppInfoMessageSelector = (state: Record<string, any>): string => state.app.infoMessage;
export const getAppCurrentUserSelector = (state: Record<string, any>): IUser => state.app.currentUser;
export const getAppPageTitleSelector = (state: Record<string, any>): string => state.app.pageTitle;
export const getAppAccountEmailSelector = (state: Record<string, any>): string => state.app.accountEmail;
export const getAppNotificationsSelector = (state: Record<string, any>): Record<string, number> =>
  state.app.notifications;
export const getAppAlertSelector = (state: Record<string, any>): IAlert => state.app.alert;

export default app.reducer;
