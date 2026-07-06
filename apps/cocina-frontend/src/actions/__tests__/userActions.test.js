import moxios from "moxios";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { login, logout } from "../userActions";
import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
} from "../../constants/userConstants";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const userData = {
    _id: 1,
    name: "Cocinero",
    email: "cocina@restobar.com",
    isAdmin: false,
    image: "/avatar.png",
    token: "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MX0.signature",
};

const credentials = { email: "cocina@restobar.com", password: "123456" };

const successResponse = {
    status: 200,
    response: userData,
};

const errorResponse = {
    status: 401,
    response: { message: "Invalid email or password" },
};

const state = {};

beforeEach(() => {
    moxios.install();
    localStorage.clear();
});

afterEach(() => {
    moxios.uninstall();
});

describe("login", () => {
    let store;

    beforeEach(() => {
        store = mockStore(state);
    });

    it("dispatches USER_LOGIN_REQUEST and USER_LOGIN_SUCCESS on successful POST", async () => {
        moxios.stubRequest("/api/users/login", successResponse);

        await store.dispatch(login(credentials.email, credentials.password));

        expect(store.getActions()).toContainEqual({ type: USER_LOGIN_REQUEST });
        expect(store.getActions()).toContainEqual({
            type: USER_LOGIN_SUCCESS,
            payload: userData,
        });
        expect(JSON.parse(localStorage.getItem("userInfo"))).toEqual(userData);
    });

    it("dispatches USER_LOGIN_REQUEST and USER_LOGIN_FAIL on failed POST", async () => {
        moxios.stubRequest("/api/users/login", errorResponse);

        await store.dispatch(login(credentials.email, credentials.password));

        expect(store.getActions()).toContainEqual({ type: USER_LOGIN_REQUEST });
        expect(store.getActions()).toContainEqual({
            type: USER_LOGIN_FAIL,
            payload: errorResponse.response.message,
        });
    });
});

describe("logout", () => {
    it("dispatches USER_LOGOUT and clears localStorage", () => {
        localStorage.setItem("userInfo", JSON.stringify(userData));
        const store = mockStore(state);

        store.dispatch(logout());

        expect(store.getActions()).toContainEqual({ type: USER_LOGOUT });
        expect(localStorage.getItem("userInfo")).toBeNull();
    });
});
