import React from "react";
import { render, cleanup, fireEvent, wait } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import ConfigScreen from "../ConfigScreen";

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

describe("ConfigScreen", () => {
    it("renders the configuration header", () => {
        const history = createMemoryHistory();
        const { getByText } = render(
            <Router history={history}>
                <ConfigScreen />
            </Router>
        );
        expect(getByText(/Configuración de Tiempos/)).toBeInTheDocument();
    });

    it("renders a back button to return to main screen", () => {
        const history = createMemoryHistory();
        const { getByText } = render(
            <Router history={history}>
                <ConfigScreen />
            </Router>
        );
        expect(getByText(/Volver/)).toBeInTheDocument();
    });
});
