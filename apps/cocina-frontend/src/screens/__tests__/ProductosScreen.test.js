import React from "react";
import { render, cleanup } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import ProductosScreen from "../ProductosScreen";

beforeEach(() => {
    localStorage.setItem("userInfo", JSON.stringify({
        token: "test-token",
        name: "Cocinero",
    }));
});

afterEach(() => {
    cleanup();
    localStorage.clear();
});

describe("ProductosScreen", () => {
    it("renders the products header", () => {
        const history = createMemoryHistory();
        const { getByText } = render(
            <Router history={history}>
                <ProductosScreen />
            </Router>
        );
        expect(getByText(/Productos/)).toBeInTheDocument();
    });

    it("renders the back button", () => {
        const history = createMemoryHistory();
        const { getByText } = render(
            <Router history={history}>
                <ProductosScreen />
            </Router>
        );
        expect(getByText(/Volver/)).toBeInTheDocument();
    });

    it("renders the create product form", () => {
        const history = createMemoryHistory();
        const { getByText } = render(
            <Router history={history}>
                <ProductosScreen />
            </Router>
        );
        expect(getByText(/Crear Producto/)).toBeInTheDocument();
    });

    it("renders the CSV import section", () => {
        const history = createMemoryHistory();
        const { getByText } = render(
            <Router history={history}>
                <ProductosScreen />
            </Router>
        );
        expect(getByText(/Importar CSV/)).toBeInTheDocument();
    });

    it("renders the producto table section", () => {
        const history = createMemoryHistory();
        const { getByText } = render(
            <Router history={history}>
                <ProductosScreen />
            </Router>
        );
        expect(getByText(/Productos \(/)).toBeInTheDocument();
    });

    it("shows empty state when no products", () => {
        const history = createMemoryHistory();
        const { getByText } = render(
            <Router history={history}>
                <ProductosScreen />
            </Router>
        );
        expect(getByText(/No hay productos registrados/)).toBeInTheDocument();
    });
});
