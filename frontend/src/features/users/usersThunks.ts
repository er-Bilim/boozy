import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '@/api/axiosApi';
import type { AuthResponse, LoginMutation, RegisterMutation } from '@/types';

export const login = createAsyncThunk<AuthResponse, LoginMutation>(
  'users/login',
  async (userData) => {
    const response = await axiosApi.post<AuthResponse>('/users/sessions', userData);
    return response.data;
  },
);

export const register = createAsyncThunk<AuthResponse, RegisterMutation>(
  'users/register',
  async (userData) => {
    const formData = new FormData();

    formData.append('email', userData.email);
    formData.append('password', userData.password);
    formData.append('displayName', userData.displayName);

    if (userData.avatar && userData.avatar[0]) {
      formData.append('avatar', userData.avatar[0]);
    }

    const response = await axiosApi.post<AuthResponse>('/users', formData);
    return response.data;
  },
);

export const googleLogin = createAsyncThunk<AuthResponse, string>(
  'users/googleLogin',
  async (credential) => {
    const formData = new FormData();
    formData.append('credential', credential);

    const response = await axiosApi.post<AuthResponse>('/users/google', formData);
    return response.data;
  },
);