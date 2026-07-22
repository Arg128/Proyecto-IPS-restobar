import {
    ORDER_PENDING_LIST_REQUEST, ORDER_PENDING_LIST_SUCCESS, ORDER_PENDING_LIST_FAIL,
} from "../constants/orderConstants";

export const orderPendingListReducer = (state = { pendingOrders: [] }, action) => {
    switch (action.type) {
        case ORDER_PENDING_LIST_REQUEST: return { loading: true, pendingOrders: [] };
        case ORDER_PENDING_LIST_SUCCESS: return { loading: false, pendingOrders: action.payload };
        case ORDER_PENDING_LIST_FAIL: return { loading: false, error: action.payload, pendingOrders: [] };
        default: return state;
    }
};