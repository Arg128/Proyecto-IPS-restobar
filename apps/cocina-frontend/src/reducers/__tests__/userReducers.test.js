import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
} from "../../constants/userConstants";

import { userLoginReducer } from "../userReducers";

const user = {
    _id: 1,
    name: "Cocinero",
    email: "cocina@restobar.com",
    token: "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MX0.signature",
};

describe("userLoginReducer", () => {
    it("handles USER_LOGIN_REQUEST", () => {
        const action = { type: USER_LOGIN_REQUEST };
        const newState = userLoginReducer({}, action);
        expect(newState).toEqual({ loading: true });
    });

    it("handles USER_LOGIN_SUCCESS", () => {
        const action = { type: USER_LOGIN_SUCCESS, payload: user };
        const newState = userLoginReducer({}, action);
        expect(newState).toEqual({ loading: false, userInfo: user });
    });

    it("handles USER_LOGIN_FAIL", () => {
        const action = { type: USER_LOGIN_FAIL, payload: "Credenciales inválidas" };
        const newState = userLoginReducer({}, action);
        expect(newState).toEqual({ loading: false, error: "Credenciales inválidas" });
    });

    it("handles USER_LOGOUT", () => {
        const action = { type: USER_LOGOUT };
        const newState = userLoginReducer({ loading: false, userInfo: user }, action);
        expect(newState).toEqual({});
    });

    it("handles action with unknown type", () => {
        const action = { type: "UNKNOWN" };
        const newState = userLoginReducer({}, action);
        expect(newState).toEqual({});
    });
});
