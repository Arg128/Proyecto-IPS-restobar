import React from "react";
import { render, cleanup } from "@testing-library/react";
import TarjetaProducto from "../TarjetaProducto";

afterEach(cleanup);

const itemEnProgreso = {
    id: 1,
    orderId: 42,
    completado: false,
    producto: { name: "Lomo Saltado" },
    eventos: [
        { nombre: "Preparación", duracionSegundos: 60, restante: 30, activo: true, completado: false },
        { nombre: "Cocción", duracionSegundos: 120, restante: 120, activo: false, completado: false },
    ],
};

const itemCompletado = {
    id: 2,
    orderId: 43,
    completado: true,
    producto: { name: "Arroz con Pollo" },
    eventos: [
        { nombre: "Preparación", duracionSegundos: 60, restante: 0, activo: false, completado: true },
        { nombre: "Cocción", duracionSegundos: 120, restante: 0, activo: false, completado: true },
    ],
};

describe("TarjetaProducto", () => {
    it("renders product name and order number", () => {
        const { getByText } = render(<TarjetaProducto item={itemEnProgreso} />);
        expect(getByText(/Lomo Saltado/)).toBeInTheDocument();
        expect(getByText(/Orden #42/)).toBeInTheDocument();
    });

    it("renders cooking events with correct status badges", () => {
        const { getByText } = render(<TarjetaProducto item={itemEnProgreso} />);
        expect(getByText(/Preparación/)).toBeInTheDocument();
        expect(getByText(/Cocción/)).toBeInTheDocument();
    });

    it("shows completado indicator when item is done", () => {
        const { getByText } = render(<TarjetaProducto item={itemCompletado} />);
        expect(getByText(/Completado/)).toBeInTheDocument();
    });

    it("shows 'Hecho' badge for completed events", () => {
        const { getAllByText } = render(<TarjetaProducto item={itemCompletado} />);
        const hechoBadges = getAllByText(/Hecho/);
        expect(hechoBadges.length).toBe(2);
    });

    it("renders without crashing when item has no producto", () => {
        const itemSinProducto = {
            id: 3,
            orderId: 44,
            completado: false,
            producto: null,
            eventos: [],
        };
        const { container } = render(<TarjetaProducto item={itemSinProducto} />);
        expect(container.querySelector(".card")).toBeInTheDocument();
    });

    it("renders without crashing when eventos is empty", () => {
        const itemSinEventos = {
            id: 4,
            orderId: 45,
            completado: false,
            producto: { name: "Ensalada" },
            eventos: [],
        };
        const { container } = render(<TarjetaProducto item={itemSinEventos} />);
        expect(container.querySelector(".card")).toBeInTheDocument();
    });
});
