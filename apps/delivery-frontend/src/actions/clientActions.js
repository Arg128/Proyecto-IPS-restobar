import axios from "axios";
import {
    CLIENT_LOGIN_REQUEST,
    CLIENT_LOGIN_SUCCESS,
    CLIENT_LOGIN_FAIL,
    CLIENT_LOGOUT,
    CLIENT_REGISTER_REQUEST,
    CLIENT_REGISTER_SUCCESS,
    CLIENT_REGISTER_FAIL,
} from "../constants/clientConstants";

export const loginClient = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: CLIENT_LOGIN_REQUEST });

        const config = {
            headers: { "Content-Type": "application/json" },
        };

        const { data } = await axios.post(
            "/api/clients/login",
            { email, password },
            config
        );

        dispatch({ type: CLIENT_LOGIN_SUCCESS, payload: data });
        localStorage.setItem("clientInfo", JSON.stringify(data));
    } catch (error) {
        dispatch({
            type: CLIENT_LOGIN_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const registerClient = (clientData) => async (dispatch) => {
    try {
        dispatch({ type: CLIENT_REGISTER_REQUEST });

        const config = {
            headers: { "Content-Type": "application/json" },
        };

        const { data } = await axios.post(
            "/api/clients/register",
            clientData,
            config
        );

        dispatch({ type: CLIENT_REGISTER_SUCCESS, payload: data });
        localStorage.setItem("clientInfo", JSON.stringify(data));
    } catch (error) {
        dispatch({
            type: CLIENT_REGISTER_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const logoutClient = () => (dispatch) => {
    window.location.reload();
    localStorage.removeItem("clientInfo");
    dispatch({ type: CLIENT_LOGOUT });
};
