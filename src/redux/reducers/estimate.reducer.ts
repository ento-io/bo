import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IEstimate, IEstimateState } from '@/types/estimate.types';

const initialState: IEstimateState = {
  loading: false,
  estimate: null,
  estimates: [],
  count: 0,
  filters: null,
};

export const estimate = createSlice({
  name: 'estimate',
  initialState,
  reducers: {
    loadEstimatesSlice: (state: IEstimateState, action: PayloadAction<IEstimate[]>) => {
      state.estimates = action.payload;
    },
    loadEstimateSlice: (state: IEstimateState, action: PayloadAction<IEstimate>) => {
      state.estimate = action.payload;
    },
    addEstimateToEstimatesSlice: (state: IEstimateState, action: PayloadAction<IEstimate>) => {
      state.estimates = [...state.estimates, action.payload];
      state.count += 1;
    },
    deleteEstimateFromEstimatesSlice: (state: IEstimateState, action: PayloadAction<string>) => {
      state.estimates = state.estimates.filter((estimate: IEstimate) => estimate.objectId !== action.payload);
      state.count -= 1;
    },
    setEstimatesCountSlice: (state: IEstimateState, action: PayloadAction<number>) => {
      state.count = action.payload;
    },
    clearEstimateSlice: (state: IEstimateState) => {
      state.estimate = null;
    },
    clearEstimatesSlice: (state: IEstimateState) => {
      state.estimates = [];
    },
    setEstimateLoadingSlice: (state: IEstimateState, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearEstimateCountSlice: (state: IEstimateState) => {
      state.count = 0;
    },
    markEstimatesAsSeenSlice: (state: IEstimateState, action: PayloadAction<string[]>) => {
      const newEstimates = state.estimates.map(prevEstimates => {
        if (action.payload.includes(prevEstimates.objectId)) {
          return {
            ...prevEstimates,
            seen: true,
          };
        }

        return prevEstimates;
      });
      state.estimates = newEstimates;
    },
    updateEstimatesByEstimateSlice: (state: IEstimateState, action: PayloadAction<IEstimate>) => {
      const newEstimates = [];

      for (const contact of state.estimates) {
        if (contact.objectId === action.payload.objectId) {
          newEstimates.unshift({
            ...contact,
            ...action.payload,
          });
        } else {
          newEstimates.push(contact);
        }
      }

      state.estimates = newEstimates;
    },
    
    setEstimateFiltersSlice: (state: IEstimateState, action: PayloadAction<Record<string, string | boolean>>) => {
      if (state.filters) {
        state.filters = { ...state.filters, ...action.payload };
        return;
      }

      state.filters = action.payload;
    },
    deleteEstimatesSlice: (state: IEstimateState, action: PayloadAction<string[]>) => {
      const newContacts = state.estimates.filter(prevEstimate => !action.payload.includes(prevEstimate.objectId));
      state.estimates = newContacts;
    },
  },
});

export const {
  setEstimateLoadingSlice,
  clearEstimateSlice,
  loadEstimateSlice,
  loadEstimatesSlice,
  setEstimatesCountSlice,
  clearEstimatesSlice,
  clearEstimateCountSlice,
  addEstimateToEstimatesSlice,
  deleteEstimateFromEstimatesSlice,
  markEstimatesAsSeenSlice,
  deleteEstimatesSlice,
  setEstimateFiltersSlice,
  updateEstimatesByEstimateSlice
} = estimate.actions;

// ---------------------------------------------- //
// ------------------ SELECTOR ------------------ //
// ---------------------------------------------- //
// NOTE: do not use RootState as state type to avoid import circular dependencies (from store.ts)
// we can not commit to git if there is circular dependencies
export const getEstimateSelector = (state: Record<string, any>): IEstimateState => state.estimate;
export const getEstimateEstimateSelector = (state: Record<string, any>): IEstimate => state.estimate.estimate;
export const getEstimateLoadingSelector = (state: Record<string, any>): boolean => state.estimate.loading;
export const getEstimateEstimatesSelector = (state: Record<string, any>): IEstimate[] => state.estimate.estimates;
export const getEstimateCountSelector = (state: Record<string, any>): number => state.estimate.count;
export const getEstimateFiltersSelector = (state: Record<string, any>): Record<string, string | boolean> => state.estimate.filters;

export default estimate.reducer;
