import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import type { User } from '@/types';
import { login, register } from './usersThunks';

interface UsersState {
  user: User | null;
  loginLoading: boolean;
  registerLoading: boolean;
}

const initialState: UsersState = {
  user: null,
  loginLoading: false,
  registerLoading: false,
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    unsetUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loginLoading = true;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loginLoading = false;
        state.user = payload.user;
      })
      .addCase(login.rejected, (state) => {
        state.loginLoading = false;
      });

    builder
      .addCase(register.pending, (state) => {
        state.registerLoading = true;
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.registerLoading = false;
        state.user = payload.user;
      })
      .addCase(register.rejected, (state) => {
        state.registerLoading = false;
      });
  },
});

export const { unsetUser } = usersSlice.actions;

export const selectUser = (state: RootState) => state.users.user;
export const selectLoginLoading = (state: RootState) => state.users.loginLoading;
export const selectRegisterLoading = (state: RootState) => state.users.registerLoading;

export default usersSlice.reducer;