import axios from "axios";
import {
    ORDER_PENDING_LIST_REQUEST, ORDER_PENDING_LIST_SUCCESS, ORDER_PENDING_LIST_FAIL,
} from "../constants/orderConstants";

export const listPendingOrders = () => async (dispatch) => {
    try {
        dispatch({ type: ORDER_PENDING_LIST_REQUEST });
        const { data } = await axios.get("/api/orders/pending");
        dispatch({ type: ORDER_PENDING_LIST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: ORDER_PENDING_LIST_FAIL, payload: error.response?.data?.message || error.message });
    }
};