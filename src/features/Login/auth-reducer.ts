import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authAPI, LoginParamsType } from "../../api/todolists-api";
import { appActions } from "../../app/app-reducer";
import { AppDispatch } from "../../app/store";
import { handleServerAppError, handleServerNetworkError } from "../../utils/error-utils";

const slice = createSlice({
  name: "auth",
  initialState: { isLoggedIn: false },
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<{ isLogged: boolean }>) => {
      state.isLoggedIn = action.payload.isLogged;
    },
  },
});
export const authReducer = slice.reducer;
export const authActions = slice.actions;
// thunks
export const loginTC = (data: LoginParamsType) => (dispatch: AppDispatch) => {
  dispatch(appActions.setAppStatus({ status: "loading" }));
  authAPI
    .login(data)
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(authActions.setIsLoggedIn({ isLogged: true }));
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch);
    });
};
export const logoutTC = () => (dispatch: AppDispatch) => {
  dispatch(appActions.setAppStatus({ status: "loading" }));
  authAPI
    .logout()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(authActions.setIsLoggedIn({ isLogged: false }));
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch);
    });
};
