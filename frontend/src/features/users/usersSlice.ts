import { createSlice } from '@reduxjs/toolkit';
import type { User } from '@/types';

interface UsersState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: UsersState = {
  user: null,
  accessToken: null,
  refreshToken: null,
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setCredentials: (state, { payload }) => {
      state.user = payload.user;
      state.accessToken = payload.accessToken;
      state.refreshToken = payload.refreshToken;
    },
    unsetUser: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const usersReducer = usersSlice.reducer;
export const { setCredentials, unsetUser } = usersSlice.actions;
export default usersReducer;
