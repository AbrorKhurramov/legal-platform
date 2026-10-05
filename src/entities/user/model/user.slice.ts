import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

import type { UserDTO } from "./user.types";

interface IUserState {
  current: UserDTO | null;
}

const initialState: IUserState = {
  current: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserDTO>) => {
      state.current = action.payload;
    },
    clearUser: (state) => {
      state.current = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
