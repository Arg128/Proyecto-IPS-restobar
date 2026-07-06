import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import LoginScreen from "../LoginScreen";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

afterEach(cleanup);

describe("LoginScreen", () => {
    it("renders the login form with email and password fields", () => {
        const store = mockStore({ userLogin: {} });
        const history = createMemoryHistory();

        const { getByPlaceholderText, getByText } = render(
            <Provider store={store}>
                <Router history={history}>
                    <LoginScreen />
                </Router>
            </Provider>
        );

        expect(getByPlaceholderText(/Email/)).toBeInTheDocument();
        expect(getByPlaceholderText(/Password/)).toBeInTheDocument();
        expect(getByText(/Ingresar/)).toBeInTheDocument();
    });

    it("renders the logo image", () => {
        const store = mockStore({ userLogin: {} });
        const history = createMemoryHistory();

        const { container } = render(
            <Provider store={store}>
                <Router history={history}>
                    <LoginScreen />
                </Router>
            </Provider>
        );

        const img = container.querySelector("img");
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute("src", "/logo.png");
        expect(img).toHaveAttribute("alt", "User profile picture");
    });

    it("shows error message when login fails", () => {
        const store = mockStore({
            userLogin: { error: "Credenciales inválidas" },
        });
        const history = createMemoryHistory();

        const { getByText } = render(
            <Provider store={store}>
                <Router history={history}>
                    <LoginScreen />
                </Router>
            </Provider>
        );

        expect(getByText(/Credenciales inválidas/)).toBeInTheDocument();
    });

    it("shows loading spinner while logging in", () => {
        const store = mockStore({
            userLogin: { loading: true },
        });
        const history = createMemoryHistory();

        const { container } = render(
            <Provider store={store}>
                <Router history={history}>
                    <LoginScreen />
                </Router>
            </Provider>
        );

        expect(container.querySelector(".spinner-border")).toBeInTheDocument();
    });

    it("redirects to / when user is already logged in", () => {
        const store = mockStore({
            userLogin: { userInfo: { name: "Cocinero", token: "abc" } },
        });
        const history = createMemoryHistory({ initialEntries: ["/login"] });

        render(
            <Provider store={store}>
                <Router history={history}>
                    <LoginScreen />
                </Router>
            </Provider>
        );

        expect(history.location.pathname).toBe("/");
    });
});
