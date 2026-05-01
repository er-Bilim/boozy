import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import type { IGlobalError, User } from '@/types';
import { googleLogin, login, register } from './usersThunks';

interface UsersState {
  user: User | null;
  loginLoading: boolean;
  registerLoading: boolean;
  loginError: IGlobalError | null;
}

const initialState: UsersState = {
  user: null,
  loginLoading: false,
  registerLoading: false,
  loginError: null,
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
        state.loginError = null;
        state.loginLoading = true;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loginLoading = false;
        state.user = payload.user;
      })
      .addCase(login.rejected, (state, { payload: error }) => {
        state.loginLoading = false;
        state.loginError = error || null;
        console.log(error);
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

    builder
      .addCase(googleLogin.pending, (state) => {
        state.loginLoading = true;
      })
      .addCase(googleLogin.fulfilled, (state, { payload }) => {
        state.loginLoading = false;
        state.user = payload.user;
      })
      .addCase(googleLogin.rejected, (state) => {
        state.loginLoading = false;
      });
  },
});

export const { unsetUser } = usersSlice.actions;

export const selectUser = (state: RootState) => state.users.user;
export const selectLoginLoading = (state: RootState) =>
  state.users.loginLoading;
export const selectRegisterLoading = (state: RootState) =>
  state.users.registerLoading;
export const selectLoginError = (state: RootState) => state.users.loginError;

export default usersSlice.reducer;
