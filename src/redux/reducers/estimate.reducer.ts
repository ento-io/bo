import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IEstimate, IEstimateState } from '@/types/estimate.type';

const initialState: IEstimateState = {
  loading: false,
  estimate: null,
  estimates: [],
};

export const estimate = createSlice({
  name: 'estimate',
  initialState,
  reducers: {
    addEstimateToEstimateSlice: (state: IEstimateState, action: PayloadAction<IEstimate>) => {
      state.estimates = [...state.estimates, action.payload];
    },
    loadEstimatesSlice: (state: IEstimateState, action: PayloadAction<IEstimate[]>) => {
      state.estimates = action.payload;
    },
    deleteEstimateFromEstimatesSlice: (state: IEstimateState, action: PayloadAction<string>) => {
      state.estimates = state.estimates.filter((estimate: IEstimate) => estimate.objectId !== action.payload);
    },
  },
});

export const {
  addEstimateToEstimateSlice,
  loadEstimatesSlice,
  deleteEstimateFromEstimatesSlice
} = estimate.actions;

// ---------------------------------------------- //
// ------------------ SELECTOR ------------------ //
// ---------------------------------------------- //
// NOTE: do not use RootState as state type to avoid import circular dependencies (from store.ts)
// we can not commit to git if there is circular dependencies
// export const getArticleSelector = (state: Record<string, any>): IArticleState => state.article;
// export const getArticleArticleSelector = (state: Record<string, any>): IArticle => state.article.article;
// export const getArticleLoadingSelector = (state: Record<string, any>): boolean => state.article.loading;
export const getEstimateEstimatesSelector = (state: Record<string, any>): IEstimate[] => state.estimate.estimates;


// export const getArticleCountSelector = (state: Record<string, any>): number => state.article.count;


export default estimate.reducer;
