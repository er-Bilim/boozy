import { createSlice } from '@reduxjs/toolkit';
import { createCocktail } from './cocktailThunk';
import type { IValidationError } from '../../types';

interface CocktailState {
  loading: {
    createLoading: boolean;
  };
  errors: {
    createError: IValidationError | null;
  };
}

const initialState: CocktailState = {
  loading: {
    createLoading: false,
  },
  errors: {
    createError: null,
  },
};

export const cocktailSlice = createSlice({
  name: 'cocktails',
  initialState,
  reducers: {},
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
  },
});

export const cocktailReducer = cocktailSlice.reducer;
