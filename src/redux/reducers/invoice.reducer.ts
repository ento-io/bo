import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IInvoice, IInvoiceState } from '@/types/invoice.type';

const initialState: IInvoiceState = {
  loading: false,
  invoice: null,
  invoices: [],
  count: 0,
  filters: null,
  error: '',
};

export const invoice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    loadInvoicesSlice: (state: IInvoiceState, action: PayloadAction<IInvoice[]>) => {
      state.invoices = action.payload;
    },
    loadInvoiceSlice: (state: IInvoiceState, action: PayloadAction<IInvoice>) => {
      state.invoice = action.payload;
    },
    addInvoiceToInvoicesSlice: (state: IInvoiceState, action: PayloadAction<IInvoice>) => {
      state.invoices = [...state.invoices, action.payload];
      state.count += 1;
    },
    deleteInvoiceFromInvoicesSlice: (state: IInvoiceState, action: PayloadAction<string>) => {
      state.invoices = state.invoices.filter((invoice: IInvoice) => invoice.objectId !== action.payload);
      state.count -= 1;
    },
    setInvoicesCountSlice: (state: IInvoiceState, action: PayloadAction<number>) => {
      state.count = action.payload;
    },
    clearInvoiceSlice: (state: IInvoiceState) => {
      state.invoice = null;
    },
    clearInvoicesSlice: (state: IInvoiceState) => {
      state.invoices = [];
    },
    setInvoiceLoadingSlice: (state: IInvoiceState, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearInvoiceCountSlice: (state: IInvoiceState) => {
      state.count = 0;
    },
    markInvoicesAsSeenSlice: (state: IInvoiceState, action: PayloadAction<string[]>) => {
      const newInvoice = state.invoices.map((prevInvoice: IInvoice) => {
        if (action.payload.includes(prevInvoice.objectId)) {
          return {
            ...prevInvoice,
            seen: true,
          };
        }

        return prevInvoice;
      });
      state.invoices = newInvoice;
    },
    updateInvoicesByInvoiceSlice: (state: IInvoiceState, action: PayloadAction<IInvoice>) => {
      const newInvoices = [];

      for (const contact of state.invoices) {
        if (contact.objectId === action.payload.objectId) {
          newInvoices.unshift({
            ...contact,
            ...action.payload,
          });
        } else {
          newInvoices.push(contact);
        }
      }

      state.invoices = newInvoices;
    },
    
    setInvoiceFiltersSlice: (state: IInvoiceState, action: PayloadAction<Record<string, string | boolean>>) => {
      if (state.filters) {
        state.filters = { ...state.filters, ...action.payload };
        return;
      }

      state.filters = action.payload;
    },
    deleteInvoicesSlice: (state: IInvoiceState, action: PayloadAction<string[]>) => {
      const newContacts = state.invoices.filter((prevInvoice: IInvoice) => !action.payload.includes(prevInvoice.objectId));
      state.invoices = newContacts;
    },
    setInvoiceErrorSlice: (state: IInvoiceState, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearInvoiceErrorSlice: (state: IInvoiceState) => {
      state.error = '';
    },
  },
});

export const {
  setInvoiceLoadingSlice,
  clearInvoiceSlice,
  loadInvoiceSlice,
  loadInvoicesSlice,
  setInvoicesCountSlice,
  clearInvoicesSlice,
  clearInvoiceCountSlice,
  addInvoiceToInvoicesSlice,
  deleteInvoiceFromInvoicesSlice,
  markInvoicesAsSeenSlice,
  deleteInvoicesSlice,
  setInvoiceFiltersSlice,
  updateInvoicesByInvoiceSlice,
  setInvoiceErrorSlice,
  clearInvoiceErrorSlice
} = invoice.actions;

// ---------------------------------------------- //
// ------------------ SELECTOR ------------------ //
// ---------------------------------------------- //
// NOTE: do not use RootState as state type to avoid import circular dependencies (from store.ts)
// we can not commit to git if there is circular dependencies
export const getInvoiceSelector = (state: Record<string, any>): IInvoiceState => state.invoice;
export const getInvoiceInvoiceSelector = (state: Record<string, any>): IInvoice => state.invoice.invoice;
export const getInvoiceLoadingSelector = (state: Record<string, any>): boolean => state.invoice.loading;
export const getInvoiceInvoicesSelector = (state: Record<string, any>): IInvoice[] => state.invoice.invoices;
export const getInvoiceCountSelector = (state: Record<string, any>): number => state.invoice.count;
export const getInvoiceErrorSelector = (state: Record<string, any>): string => state.invoice.error;
export const getInvoiceFiltersSelector = (state: Record<string, any>): Record<string, string | boolean> => state.invoice.filters;

export default invoice.reducer;
