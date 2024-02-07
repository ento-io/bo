import { PaletteMode } from '@mui/material';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ISettingState, Lang } from '@/types/setting.type';
import { DEFAULT_THEME_COLOR } from '@/utils/theme.utils';

const initialState: ISettingState = {
  lang: '',
  isAuthenticated: false,
  theme: 'light',
  themeColor: DEFAULT_THEME_COLOR,
  isSideBarOpen: true,
};

export const settings: any = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLang: (state: ISettingState, action: PayloadAction<Lang>) => {
      state.lang = action.payload;
    },
    changeThemeSlice: (state: ISettingState, action: PayloadAction<PaletteMode>) => {
      state.theme = action.payload;
    },
    changeThemeColorSlice: (state: ISettingState, action: PayloadAction<string>) => {
      state.themeColor = action.payload;
    },
    changeIsSideBarOpenSlice: (state: ISettingState, action: PayloadAction<boolean>) => {
      state.isSideBarOpen = action.payload;
    },
    toggleIsAuthenticatedSlice: (state: ISettingState, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
  },
});

export const {
  setLang,
  toggleIsAuthenticatedSlice,
  changeThemeSlice,
  changeThemeColorSlice,
  changeIsSideBarOpenSlice,
  setCurrentCooperativeSlice,
  clearCurrentCooperativeSlice,
} = settings.actions;

// ---------------------------------------------- //
// ------------------ SELECTOR ------------------ //
// ---------------------------------------------- //
// NOTE: do not use RootState as state type to avoid import circular dependencies (from store.ts)
// we can not commit to git if there is circular dependencies
export const getSettingsSelector = (state: Record<string, any>): ISettingState => state.settings;
export const getSettingsThemeSelector = (state: Record<string, any>): PaletteMode => state.settings.theme;
export const getSettingsThemeColorSelector = (state: Record<string, any>): string => state.settings.themeColor;
export const getSettingsIsSideBarOpenSelector = (state: Record<string, any>): boolean => state.settings.isSideBarOpen;
export const getSettingsLangSelector = (state: Record<string, any>): Lang => state.settings.lang;
export const getSettingsIsAuthenticatedSelector = (state: Record<string, any>): boolean =>
  state.settings.isAuthenticated;

export default settings.reducer;
