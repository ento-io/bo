import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPage, IPageState } from '@/types/page.type';

const initialState: IPageState = {
  loading: false,
  page: null,
  pages: [],
  count: 0,
};

export const page = createSlice({
  name: 'page',
  initialState,
  reducers: {
    loadPagesSlice: (state: IPageState, action: PayloadAction<IPage[]>) => {
      state.pages = action.payload;
    },
    loadPageSlice: (state: IPageState, action: PayloadAction<IPage>) => {
      state.page = action.payload;
    },
    addPageToPagesSlice: (state: IPageState, action: PayloadAction<IPage>) => {
      state.pages = [...state.pages, action.payload];
      state.count += 1;
    },
    deletePageFromPagesSlice: (state: IPageState, action: PayloadAction<string>) => {
      state.pages = state.pages.filter((page: IPage) => page.objectId !== action.payload);
      state.count -= 1;
    },
    setPagesCountSlice: (state: IPageState, action: PayloadAction<number>) => {
      state.count = action.payload;
    },
    clearPageSlice: (state: IPageState) => {
      state.page = null;
    },
    clearPagesSlice: (state: IPageState) => {
      state.pages = [];
    },
    setPageLoadingSlice: (state: IPageState, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearPageCountSlice: (state: IPageState) => {
      state.count = 0;
    },
    deletePagesSlice: (state: IPageState, action: PayloadAction<string[]>) => {
      const newPages = state.pages.filter(prevPage => !action.payload.includes(prevPage.objectId));
      state.pages = newPages;
    },
  },
});

export const {
  setPageLoadingSlice,
  clearPageSlice,
  loadPageSlice,
  loadPagesSlice,
  setPagesCountSlice,
  clearPagesSlice,
  clearPageCountSlice,
  addPageToPagesSlice,
  deletePageFromPagesSlice,
  deletePagesSlice,
} = page.actions;

// ---------------------------------------------- //
// ------------------ SELECTOR ------------------ //
// ---------------------------------------------- //
// NOTE: do not use RootState as state type to avoid import circular dependencies (from store.ts)
// we can not commit to git if there is circular dependencies
export const getPageSelector = (state: Record<string, any>): IPageState => state.page;
export const getPagePageSelector = (state: Record<string, any>): IPage => state.page.page;
export const getPageLoadingSelector = (state: Record<string, any>): boolean => state.page.loading;
export const getPagePagesSelector = (state: Record<string, any>): IPage[] => state.page.pages;
export const getPageCountSelector = (state: Record<string, any>): number => state.page.count;

export default page.reducer;
