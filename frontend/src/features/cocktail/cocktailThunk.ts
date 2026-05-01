import type { ICocktailMutation, IValidationError } from '@/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { isAxiosError } from 'axios';
import axiosApi from '@/api/axiosApi';

export const createCocktail = createAsyncThunk<
  void,
  ICocktailMutation,
  { rejectValue: IValidationError; state: RootState }
>('cocktail/createCocktail', async (cocktail, { rejectWithValue }) => {
  try {
    const newIngredientData = {
      ...cocktail,
      ingredients: JSON.stringify(cocktail.ingredients),
    };

    const formData = new FormData();

    const keys = Object.keys(newIngredientData) as (keyof ICocktailMutation)[];

    keys.forEach((key) => {
      const value = newIngredientData[key];

      if (value) {
        formData.append(key, value);
      }
    });

    await axiosApi.post('/cocktails', formData);
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response) {
        rejectWithValue(error.response.data);
      }
    }

    throw error;
  }
});
