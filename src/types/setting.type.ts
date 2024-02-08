import { PaletteColorOptions, PaletteMode } from '@mui/material';

export type Lang = 'fr' | 'mg' | 'en' | '';
export enum Langs {
  FRENCH = 'fr',
  ENGLISH = 'en',
  MALAGASY = 'mg',
}

export interface ISettingState {
  lang: Lang;
  isAuthenticated?: boolean;
  theme: PaletteMode;
  themeColor: string;
  isSideBarOpen: boolean;
}

interface IReduxPersistDefaultValues {
  version: number;
  rehydrated: boolean;
}
export interface IStoredData {
  _persist: IReduxPersistDefaultValues;
  settings: ISettingState;
}

export interface IThemeColors {
  name: string;
  colors: PaletteColorOptions;
}
