import {
    PRODUCTOS_REQUEST,
    PRODUCTOS_SUCCESS,
    PRODUCTOS_FAIL,
    PEDIDOS_REQUEST,
    PEDIDOS_SUCCESS,
    PEDIDOS_FAIL,
} from "../../constants/coccionConstants";

import {
    productosConEventosReducer,
    ordenesPendientesReducer,
} from "../coccionReducers";

const producto = {
    id: 1,
    name: "Lomo Saltado",
    price: 25.0,
    stock: 10,
    tiemposCoccion: { principal: 600 },
    eventosCoccion: [{ nombre: "Preparación", duracionSegundos: 120, orden: 0 }],
};

const dataProductos = [producto];

const pedido = {
    id: 1,
    tableId: 5,
    products: [
        {
            id: 1,
            name: "Lomo Saltado",
            OrderProduct: { quantity: 2 },
            eventosCoccion: [],
        },
    ],
};

const dataPedidos = [pedido];

describe("productosConEventosReducer", () => {
    it("handles PRODUCTOS_REQUEST", () => {
        const action = { type: PRODUCTOS_REQUEST };
        const newState = productosConEventosReducer({ items: [] }, action);
        expect(newState).toEqual({ loading: true, items: [] });
    });

    it("handles PRODUCTOS_SUCCESS", () => {
        const action = { type: PRODUCTOS_SUCCESS, payload: dataProductos };
        const newState = productosConEventosReducer({ items: [] }, action);
        expect(newState).toEqual({ loading: false, items: dataProductos });
    });

    it("handles PRODUCTOS_FAIL", () => {
        const action = { type: PRODUCTOS_FAIL, payload: "Error al cargar productos" };
        const newState = productosConEventosReducer({ items: [] }, action);
        expect(newState).toEqual({ loading: false, error: "Error al cargar productos" });
    });

    it("handles action with unknown type", () => {
        const action = { type: "UNKNOWN" };
        const newState = productosConEventosReducer({ items: [] }, action);
        expect(newState).toEqual({ items: [] });
    });
});

describe("ordenesPendientesReducer", () => {
    it("handles PEDIDOS_REQUEST", () => {
        const action = { type: PEDIDOS_REQUEST };
        const newState = ordenesPendientesReducer({ items: [] }, action);
        expect(newState).toEqual({ loading: true, items: [] });
    });

    it("handles PEDIDOS_SUCCESS", () => {
        const action = { type: PEDIDOS_SUCCESS, payload: dataPedidos };
        const newState = ordenesPendientesReducer({ items: [] }, action);
        expect(newState).toEqual({ loading: false, items: dataPedidos });
    });

    it("handles PEDIDOS_FAIL", () => {
        const action = { type: PEDIDOS_FAIL, payload: "Error al cargar pedidos" };
        const newState = ordenesPendientesReducer({ items: [] }, action);
        expect(newState).toEqual({ loading: false, error: "Error al cargar pedidos" });
    });

    it("handles action with unknown type", () => {
        const action = { type: "UNKNOWN" };
        const newState = ordenesPendientesReducer({ items: [] }, action);
        expect(newState).toEqual({ items: [] });
    });
});
