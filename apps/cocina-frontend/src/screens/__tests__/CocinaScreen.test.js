import React from "react";
import { render, cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import CocinaScreen from "../CocinaScreen";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

afterEach(cleanup);

const pendientes = [
    {
        id: 1,
        tableId: 5,
        products: [
            { id: 1, name: "Lomo Saltado", OrderProduct: { quantity: 2 }, eventosCoccion: [] },
        ],
    },
];

describe("CocinaScreen", () => {
    it("renders without crashing with default state", () => {
        const store = mockStore({
            userLogin: { userInfo: { token: "abc" } },
            productosConEventos: { items: [] },
            ordenesPendientes: { items: [] },
        });
        const history = createMemoryHistory();

        const { getByText } = render(
            <Provider store={store}>
                <Router history={history}>
                    <CocinaScreen />
                </Router>
            </Provider>
        );

        expect(getByText(/Cocina/)).toBeInTheDocument();
    });

    it("renders pending orders section", () => {
        const store = mockStore({
            userLogin: { userInfo: { token: "abc" } },
            productosConEventos: { items: [] },
            ordenesPendientes: { items: pendientes },
        });
        const history = createMemoryHistory();

        const { getByText } = render(
            <Provider store={store}>
                <Router history={history}>
                    <CocinaScreen />
                </Router>
            </Provider>
        );

        expect(getByText(/Pedidos Pendientes/)).toBeInTheDocument();
        expect(getByText(/Lomo Saltado/)).toBeInTheDocument();
        expect(getByText(/Mesa 5/)).toBeInTheDocument();
    });

    it("renders empty state messages when no data", () => {
        const store = mockStore({
            userLogin: { userInfo: { token: "abc" } },
            productosConEventos: { items: [] },
            ordenesPendientes: { items: [] },
        });
        const history = createMemoryHistory();

        const { getByText } = render(
            <Provider store={store}>
                <Router history={history}>
                    <CocinaScreen />
                </Router>
            </Provider>
        );

        expect(getByText(/No hay pedidos/)).toBeInTheDocument();
    });

    it("renders navigation links (Menú, Productos, Salir)", () => {
        const store = mockStore({
            userLogin: { userInfo: { token: "abc" } },
            productosConEventos: { items: [] },
            ordenesPendientes: { items: [] },
        });
        const history = createMemoryHistory();

        const { getByText } = render(
            <Provider store={store}>
                <Router history={history}>
                    <CocinaScreen />
                </Router>
            </Provider>
        );

        expect(getByText(/Menú/)).toBeInTheDocument();
        expect(getByText(/Productos/)).toBeInTheDocument();
        expect(getByText(/Salir/)).toBeInTheDocument();
    });

    it("shows loading spinner when orders are loading", () => {
        const store = mockStore({
            userLogin: { userInfo: { token: "abc" } },
            productosConEventos: { items: [] },
            ordenesPendientes: { loading: true, items: [] },
        });
        const history = createMemoryHistory();

        const { container } = render(
            <Provider store={store}>
                <Router history={history}>
                    <CocinaScreen />
                </Router>
            </Provider>
        );

        expect(container.querySelector(".spinner-border")).toBeInTheDocument();
    });
});
