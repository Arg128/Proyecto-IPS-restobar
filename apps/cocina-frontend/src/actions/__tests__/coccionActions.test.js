import moxios from "moxios";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {
    fetchProductosConEventos,
    fetchPedidos,
} from "../coccionActions";
import {
    PRODUCTOS_REQUEST,
    PRODUCTOS_SUCCESS,
    PRODUCTOS_FAIL,
    PEDIDOS_REQUEST,
    PEDIDOS_SUCCESS,
    PEDIDOS_FAIL,
} from "../../constants/coccionConstants";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const dataProductos = [
    {
        id: 1,
        name: "Lomo Saltado",
        price: 25.0,
        stock: 10,
        tiemposCoccion: { principal: 600 },
        eventosCoccion: [{ nombre: "Preparación", duracionSegundos: 120, orden: 0 }],
    },
];

const dataPedidos = [
    {
        id: 1,
        tableId: 5,
        products: [
            { id: 1, name: "Lomo Saltado", OrderProduct: { quantity: 2 }, eventosCoccion: [] },
        ],
    },
];

const errorResponse = {
    status: 500,
    response: { message: "Error del servidor" },
};

const successProductosResponse = {
    status: 200,
    response: dataProductos,
};

const successPedidosResponse = {
    status: 200,
    response: dataPedidos,
};

const state = {
    userLogin: { userInfo: { token: "test-token" } },
};

beforeEach(() => {
    moxios.install();
});

afterEach(() => {
    moxios.uninstall();
});

describe("fetchProductosConEventos", () => {
    let store;

    beforeEach(() => {
        store = mockStore(state);
    });

    it("dispatches PRODUCTOS_REQUEST and PRODUCTOS_SUCCESS on successful GET", async () => {
        moxios.stubRequest("/api/coccion/tiempos/productos", successProductosResponse);

        await store.dispatch(fetchProductosConEventos());

        expect(store.getActions()).toContainEqual({ type: PRODUCTOS_REQUEST });
        expect(store.getActions()).toContainEqual({
            type: PRODUCTOS_SUCCESS,
            payload: dataProductos,
        });
    });

    it("dispatches PRODUCTOS_REQUEST and PRODUCTOS_FAIL on failed GET", async () => {
        moxios.stubRequest("/api/coccion/tiempos/productos", errorResponse);

        await store.dispatch(fetchProductosConEventos());

        expect(store.getActions()).toContainEqual({ type: PRODUCTOS_REQUEST });
        expect(store.getActions()).toContainEqual({
            type: PRODUCTOS_FAIL,
            payload: errorResponse.response.message,
        });
    });
});

describe("fetchPedidos", () => {
    let store;

    beforeEach(() => {
        store = mockStore(state);
    });

    it("dispatches PEDIDOS_REQUEST and PEDIDOS_SUCCESS on successful GET", async () => {
        moxios.stubRequest("/api/coccion/pedidos", successPedidosResponse);

        await store.dispatch(fetchPedidos());

        expect(store.getActions()).toContainEqual({ type: PEDIDOS_REQUEST });
        expect(store.getActions()).toContainEqual({
            type: PEDIDOS_SUCCESS,
            payload: dataPedidos,
        });
    });

    it("dispatches PEDIDOS_REQUEST and PEDIDOS_FAIL on failed GET", async () => {
        moxios.stubRequest("/api/coccion/pedidos", errorResponse);

        await store.dispatch(fetchPedidos());

        expect(store.getActions()).toContainEqual({ type: PEDIDOS_REQUEST });
        expect(store.getActions()).toContainEqual({
            type: PEDIDOS_FAIL,
            payload: errorResponse.response.message,
        });
    });
});
