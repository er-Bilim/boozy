import { createSlice } from '@reduxjs/toolkit';
import {
  createCocktail,
  deleteCocktail,
  fetchCocktails,
  fetchMyCocktails,
  publishCocktail,
} from './cocktailThunks.ts';
import type { ICocktail, IValidationError } from '@/types';

interface CocktailState {
  cocktails: ICocktail[];
  loading: {
    createLoading: boolean;
    fetchLoading: boolean;
  };
  errors: {
    createError: IValidationError | null;
  };
}

const initialState: CocktailState = {
  cocktails: [],
  loading: {
    createLoading: false,
    fetchLoading: false,
  },
  errors: {
    createError: null,
  },
};

export const cocktailSlice = createSlice({
  name: 'cocktails',
  initialState,
  reducers: {
    clearCocktails: (state) => {
      state.cocktails = [];
    },
  },
  extraReducers(builder) {
    builder.addCase(createCocktail.pending, (state) => {
      state.loading.createLoading = true;
      state.errors.createError = null;
    });
    builder.addCase(createCocktail.fulfilled, (state) => {
      state.loading.createLoading = false;
    });
    builder.addCase(createCocktail.rejected, (state, { payload: error }) => {
      state.loading.createLoading = false;
      state.errors.createError = error || null;
    });
    builder.addCase(fetchCocktails.pending, (state) => {
      state.loading.fetchLoading = true;
    });
    builder.addCase(fetchCocktails.fulfilled, (state, { payload }) => {
      state.loading.fetchLoading = false;
      state.cocktails = payload;
    });
    builder.addCase(fetchCocktails.rejected, (state) => {
      state.loading.fetchLoading = false;
    });
    builder.addCase(fetchMyCocktails.pending, (state) => {
      state.loading.fetchLoading = true;
    });
    builder.addCase(fetchMyCocktails.fulfilled, (state, { payload }) => {
      state.loading.fetchLoading = false;
      state.cocktails = payload;
    });
    builder.addCase(fetchMyCocktails.rejected, (state) => {
      state.loading.fetchLoading = false;
    });
    builder.addCase(deleteCocktail.fulfilled, (state, { meta }) => {
      state.cocktails = state.cocktails.filter(
        (cocktail) => cocktail._id !== meta.arg,
      );
    });
    builder.addCase(publishCocktail.fulfilled, (state, { meta }) => {
      const index = state.cocktails.findIndex((c) => c._id === meta.arg);
      if (index !== -1) {
        state.cocktails[index].isPublished = true;
      }
    });
  },
});

export const cocktailReducer = cocktailSlice.reducer;
export const { clearCocktails } = cocktailSlice.actions;
