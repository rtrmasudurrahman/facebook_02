import {
  LOGIN_FAILED,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  REGISTER_FAILED,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  TOKEN_USER_FAILED,
  TOKEN_USER_SUCCESS,
  USER_LOGOUT,
} from "./authActionTypes";
import initialState from "./initialState";

/*
 * create auth reducer
 */
const authReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case REGISTER_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        message: payload,
      };

    case REGISTER_FAILED:
      return {
        ...state,
        loading: false,
        message: payload,
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        user: payload,
        loginState: true,
      };
    case LOGIN_FAILED:
      return {
        ...state,
        user: null,
        loadingState: false,
        loading: false,
      };
    case TOKEN_USER_SUCCESS:
      return {
        ...state,
        user: payload,
        loginState: true,
      };
    case TOKEN_USER_FAILED:
      return {
        ...state,
        user: null,
        loginState: false,
      };
    case USER_LOGOUT:
      return {
        ...state,
        user: null,
        loginState: false,
      };
    default:
      return state;
  }
};

export default authReducer;
