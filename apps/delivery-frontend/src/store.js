import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { clientLoginReducer, clientRegisterReducer } from "./reducers/clientReducers";

const reducer = combineReducers({
    clientLogin: clientLoginReducer,
    clientRegister: clientRegisterReducer,
});

const clientInfoFromStorage = localStorage.getItem("clientInfo")
    ? JSON.parse(localStorage.getItem("clientInfo"))
    : null;

const initialState = {
    clientLogin: { clientInfo: clientInfoFromStorage },
};

const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
