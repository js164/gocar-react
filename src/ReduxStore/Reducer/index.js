import AdminStatus from "./admin";
import AuthStatus from "./auth";
import AlertStatus from "./alert";
import { combineReducers } from "redux";

const rootReducer= combineReducers({
    AdminStatus,
    AuthStatus,
    AlertStatus
})

export default rootReducer