import { configureStore } from "@reduxjs/toolkit";

import { authSlice } from "@/entities/auth/auth.entry";
import { userSlice } from "@/entities/user/user.entry";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    user: userSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
