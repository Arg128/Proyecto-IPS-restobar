import { createStore, applyMiddleware, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { pagoListReducer, pagoCreateReducer } from "./reducers/pagoReducers";
import { facturaListReducer, facturaCreateReducer, facturaDetailReducer } from "./reducers/facturaReducers";
import { gastoListReducer, gastoCreateReducer } from "./reducers/gastoReducers";
import { estadisticaReducer } from "./reducers/estadisticaReducers";
import { orderPendingListReducer } from "./reducers/orderReducers";

const reducer = combineReducers({
    pagoList: pagoListReducer,
    pagoCreate: pagoCreateReducer,
    facturaList: facturaListReducer,
    facturaCreate: facturaCreateReducer,
    facturaDetail: facturaDetailReducer,
    gastoList: gastoListReducer,
    gastoCreate: gastoCreateReducer,
    estadisticas: estadisticaReducer,
    orderPendingList: orderPendingListReducer,
});

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(thunk))
);

export default store;