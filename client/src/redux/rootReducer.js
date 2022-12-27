import { combineReducers } from "redux";
import authReducer from "./auth/authReducer";
import loaderReducer from "./top-loader/loaderReducer";

//create root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  loader: loaderReducer,
});

export default rootReducer;
