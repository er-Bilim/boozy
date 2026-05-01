import type { ICocktail, ICocktailMutation, IValidationError } from '@/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store.ts';
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

export const fetchCocktails = createAsyncThunk<
  ICocktail[],
  void,
  { rejectValue: string }
>('cocktail/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosApi.get('/cocktails');
    return response.data || [];
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response) {
        rejectWithValue(error.response.data);
      }
    }

    throw error;
  }
});

export const fetchMyCocktails = createAsyncThunk<
  ICocktail[],
  void,
  { rejectValue: string }
>('cocktail/fetchMy', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosApi.get('/cocktails/my');
    if (response.data !== null) return response.data;
    return [];
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response) {
        rejectWithValue(error.response.data);
      }
    }

    throw error;
  }
});

export const publishCocktail = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('cocktail/publish', async (id, { rejectWithValue }) => {
  try {
    await axiosApi.patch(`/cocktails/${id}/publish`);
    return id;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response) {
        rejectWithValue(error.response.data);
      }
    }

    throw error;
  }
});

export const deleteCocktail = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('cocktail/delete', async (id, { rejectWithValue }) => {
  try {
    await axiosApi.delete(`/cocktails/${id}/delete`);
    return id;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response) {
        rejectWithValue(error.response.data);
      }
    }

    throw error;
  }
});
