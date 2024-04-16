import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICategory, ICategoryState } from '@/types/category.type';

const initialState: ICategoryState = {
  loading: false,
  category: null,
  categories: [],
  count: 0,
};

export const category = createSlice({
  name: 'category',
  initialState,
  reducers: {
    loadCategoriesSlice: (state: ICategoryState, action: PayloadAction<ICategory[]>) => {
      state.categories = action.payload;
    },
    loadCategorySlice: (state: ICategoryState, action: PayloadAction<ICategory>) => {
      state.category = action.payload;
    },
    addCategoryTCategoriesSlice: (state: ICategoryState, action: PayloadAction<ICategory>) => {
      state.categories = [...state.categories, action.payload];
      state.count += 1;
    },
    deleteCategoryFromCategoriesSlice: (state: ICategoryState, action: PayloadAction<string>) => {
      state.categories = state.categories.filter((category: ICategory) => category.objectId !== action.payload);
      state.count -= 1;
    },
    setCategoriesCountSlice: (state: ICategoryState, action: PayloadAction<number>) => {
      state.count = action.payload;
    },
    updateCategoriesByCategorySlice: (state: ICategoryState, action: PayloadAction<ICategory>) => {
      const newCategories = [];

      for (const category of state.categories) {
        if (category.objectId === action.payload.objectId) {
          newCategories.unshift({
            ...category,
            ...action.payload,
          });
        } else {
          newCategories.push(category);
        }
      }

      state.categories = newCategories;
    },
    clearCategorySlice: (state: ICategoryState) => {
      state.category = null;
    },
    clearCategoriesSlice: (state: ICategoryState) => {
      state.categories = [];
    },
    setCategoryLoadingSlice: (state: ICategoryState, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearCategoryCountSlice: (state: ICategoryState) => {
      state.count = 0;
    },
    deleteCategoriesSlice: (state: ICategoryState, action: PayloadAction<string[]>) => {
      const newCategories = state.categories.filter(prevCategory => !action.payload.includes(prevCategory.objectId));
      state.categories = newCategories;
    },
  },
});

export const {
  setCategoryLoadingSlice,
  clearCategorySlice,
  loadCategorySlice,
  loadCategoriesSlice,
  setCategoriesCountSlice,
  clearCategoriesSlice,
  clearCategoryCountSlice,
  addCategoryTCategoriesSlice,
  deleteCategoryFromCategoriesSlice,
  deleteCategoriesSlice,
  updateCategoriesByCategorySlice
} = category.actions;

// ---------------------------------------------- //
// ------------------ SELECTOR ------------------ //
// ---------------------------------------------- //
// NOTE: do not use RootState as state type to avoid import circular dependencies (from store.ts)
// we can not commit to git if there is circular dependencies
export const getCategorySelector = (state: Record<string, any>): ICategoryState => state.category;
export const getCategoryCategorySelector = (state: Record<string, any>): ICategory => state.category.category;
export const getCategoryLoadingSelector = (state: Record<string, any>): boolean => state.category.loading;
export const getCategoryCategoriesSelector = (state: Record<string, any>): ICategory[] => state.category.categories;
export const getCategoryCountSelector = (state: Record<string, any>): number => state.category.count;

export default category.reducer;
