import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '@/api/axiosApi';
import type {
  AuthResponse,
  IGlobalError,
  LoginMutation,
  RegisterMutation,
} from '@/types';
import type { RootState } from '@/app/store';
import { isAxiosError } from 'axios';

export const login = createAsyncThunk<
  AuthResponse,
  LoginMutation,
  { rejectValue: IGlobalError; state: RootState }
>('users/login', async (userData, { rejectWithValue }) => {
  try {
    const response = await axiosApi.post<AuthResponse>(
      '/users/sessions',
      userData,
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
    }

    throw error;
  }
});

export const register = createAsyncThunk<AuthResponse, RegisterMutation>(
  'users/register',
  async (userData) => {
    const formData = new FormData();
    const keys = Object.keys(userData) as (keyof RegisterMutation)[];

    keys.forEach((key) => {
      const value = userData[key];

      if (value) {
        formData.append(key, value);
      }
    });

    const response = await axiosApi.post<AuthResponse>('/users', formData);
    return response.data;
  },
);

export const googleLogin = createAsyncThunk<AuthResponse, string>(
  'users/googleLogin',
  async (credential) => {
    const formData = new FormData();
    formData.append('credential', credential);

    const response = await axiosApi.post<AuthResponse>(
      '/users/google',
      formData,
    );
    return response.data;
  },
);
