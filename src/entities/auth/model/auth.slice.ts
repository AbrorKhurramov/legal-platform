import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

import { STORAGE_KEYS } from "@/shared/const/storage-const";

interface IAuthState {
  accessToken: string | null;
}

const initialState: IAuthState = {
  accessToken: localStorage.getItem(STORAGE_KEYS.accessToken),
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      localStorage.setItem(STORAGE_KEYS.accessToken, action.payload);
      state.accessToken = action.payload;
    },
    logout: (state) => {
      localStorage.removeItem(STORAGE_KEYS.accessToken);
      state.accessToken = null;
    },
  },
});

export const { setAccessToken, logout } = authSlice.actions;
