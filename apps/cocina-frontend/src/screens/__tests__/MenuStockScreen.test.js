import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import MenuStockScreen from "../MenuStockScreen";

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

describe("MenuStockScreen", () => {
    it("renders the menu header", () => {
        const history = createMemoryHistory();
        const { getByText } = render(
            <Router history={history}>
                <MenuStockScreen />
            </Router>
        );
        expect(getByText(/Menú y Stock de Provisiones/)).toBeInTheDocument();
    });

    it("renders the back button", () => {
        const history = createMemoryHistory();
        const { getByText } = render(
            <Router history={history}>
                <MenuStockScreen />
            </Router>
        );
        expect(getByText(/Volver/)).toBeInTheDocument();
    });

    it("renders the recipe list section", () => {
        const history = createMemoryHistory();
        const { getByText } = render(
            <Router history={history}>
                <MenuStockScreen />
            </Router>
        );
        expect(getByText(/Lista de platos y sus ingredientes/)).toBeInTheDocument();
    });

    it("shows empty state message when no recipes exist", () => {
        const history = createMemoryHistory();
        const { getByText } = render(
            <Router history={history}>
                <MenuStockScreen />
            </Router>
        );
        expect(getByText(/No hay recetas configuradas/)).toBeInTheDocument();
    });

    it("renders the ingredient configuration panel", () => {
        const history = createMemoryHistory();
        const { getByText } = render(
            <Router history={history}>
                <MenuStockScreen />
            </Router>
        );
        expect(getByText(/Configurar ingredientes/)).toBeInTheDocument();
        expect(getByText(/Seleccionar plato/)).toBeInTheDocument();
    });

    it("renders the product selector dropdown", () => {
        const history = createMemoryHistory();
        const { container } = render(
            <Router history={history}>
                <MenuStockScreen />
            </Router>
        );
        const select = container.querySelector("select");
        expect(select).toBeInTheDocument();
        expect(select.options[0].text).toBe("Seleccionar...");
    });
});
