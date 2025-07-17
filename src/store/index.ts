import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import leaveReducer from "./leaveSlice";
import userReducer from "./userSlice";
import adminReducer from "./adminSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    leaves: leaveReducer,
    users: userReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
