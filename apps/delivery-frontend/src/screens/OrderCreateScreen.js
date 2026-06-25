import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const OrderCreateScreen = ({ history }) => {
    const [cliente, setCliente] = useState({ nombre: "", direccion: "", telefono: "" });
    const [nota, setNota] = useState("");
    const [productos] = useState([
        { id: 1, nombre: "Lomo Saltado", precio: 18.00 },
        { id: 2, nombre: "Inca Kola 500ml", precio: 4.75 },
        { id: 3, nombre: "Arroz con Leche", precio: 8.00 },
        { id: 4, nombre: "Ceviche", precio: 25.00 },
    ]);
    const [carrito, setCarrito] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const agregarProducto = (producto) => {
        const existe = carrito.find((p) => p.id === producto.id);
        if (existe) {
            setCarrito(carrito.map((p) =>
                p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
            ));
        } else {
            setCarrito([...carrito, { ...producto, cantidad: 1 }]);
        }
    };

    const quitarProducto = (id) => {
        setCarrito(carrito.filter((p) => p.id !== id));
    };

    const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

    const handleSubmit = async () => {
        let erroresCheck = {};
        if (!cliente.nombre) erroresCheck.nombre = "El nombre es requerido";
        if (!cliente.direccion) erroresCheck.direccion = "La direccion es requerida";
        if (!cliente.telefono) erroresCheck.telefono = "El telefono es requerido";
        if (carrito.length === 0) erroresCheck.carrito = "Agrega al menos un producto";

        if (Object.keys(erroresCheck).length > 0) {
            setErrors(erroresCheck);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            await axios.post("/api/delivery/pedidos", {
                cliente: cliente.nombre,
                direccion: cliente.direccion,
                telefono: cliente.telefono,
                nota: nota,
                total: total,
                productos: carrito,
            });
            history.push("/delivery");
        } catch (err) {
            setErrors({ general: "Error al crear el pedido. Intenta de nuevo." });
            setLoading(false);
        }
    };

    return (
        <>
            <div className="content-header">
                <div className="container-fluid">
                    <div className="d-flex align-items-center">
                        <Link to="/delivery" className="btn btn-secondary btn-sm mr-3">
                            <i className="fas fa-arrow-left mr-1" /> Volver
                        </Link>
                        <h1 className="m-0">
                            <i className="fas fa-plus mr-2" />
                            Nuevo Pedido Delivery
                        </h1>
                    </div>
                </div>
            </div>

            <section className="content">
                <div className="container-fluid">

                    {errors.general && (
                        <div className="alert alert-danger">{errors.general}</div>
                    )}

                    <div className="row">
                        <div className="col-12 col-md-6">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">
                                        <i className="fas fa-utensils mr-2" />
                                        Productos Disponibles
                                    </h3>
                                </div>
                                <div className="card-body table-responsive p-0">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Producto</th>
                                                <th>Precio</th>
                                                <th>Agregar</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {productos.map((p) => (
                                                <tr key={p.id}>
                                                    <td>{p.nombre}</td>
                                                    <td>S/ {p.precio.toFixed(2)}</td>
                                                    <td>
                                                        <button className="btn btn-success btn-sm" onClick={() => agregarProducto(p)}>
                                                            <i className="fas fa-plus" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">
                                        <i className="fas fa-shopping-cart mr-2" />
                                        Carrito
                                    </h3>
                                </div>
                                <div className="card-body table-responsive p-0">
                                    {errors.carrito && (
                                        <div className="alert alert-warning mx-3 mt-2">{errors.carrito}</div>
                                    )}
                                    {carrito.length === 0 ? (
                                        <p className="text-center text-muted py-3">No hay productos en el carrito</p>
                                    ) : (
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Producto</th>
                                                    <th>Cant.</th>
                                                    <th>Subtotal</th>
                                                    <th>Quitar</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {carrito.map((p) => (
                                                    <tr key={p.id}>
                                                        <td>{p.nombre}</td>
                                                        <td><span className="badge badge-primary">{p.cantidad}</span></td>
                                                        <td>S/ {(p.precio * p.cantidad).toFixed(2)}</td>
                                                        <td>
                                                            <button className="btn btn-danger btn-sm" onClick={() => quitarProducto(p.id)}>
                                                                <i className="fas fa-trash" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <td colSpan="2" className="text-right font-weight-bold">TOTAL:</td>
                                                    <td colSpan="2">
                                                        <span className="badge badge-success" style={{ fontSize: "1rem" }}>
                                                            S/ {total.toFixed(2)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-md-6">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">
                                        <i className="fas fa-user mr-2" />
                                        Datos del Cliente
                                    </h3>
                                </div>
                                <div className="card-body">
                                    <div className="form-group">
                                        <label>Nombre completo</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                                            placeholder="Juan Perez"
                                            value={cliente.nombre}
                                            onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })}
                                        />
                                        {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                                    </div>
                                    <div className="form-group">
                                        <label>Direccion</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.direccion ? "is-invalid" : ""}`}
                                            placeholder="Av. Lima 123"
                                            value={cliente.direccion}
                                            onChange={(e) => setCliente({ ...cliente, direccion: e.target.value })}
                                        />
                                        {errors.direccion && <div className="invalid-feedback">{errors.direccion}</div>}
                                    </div>
                                    <div className="form-group">
                                        <label>Telefono</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.telefono ? "is-invalid" : ""}`}
                                            placeholder="987654321"
                                            value={cliente.telefono}
                                            onChange={(e) => setCliente({ ...cliente, telefono: e.target.value })}
                                        />
                                        {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
                                    </div>
                                    <div className="form-group">
                                        <label>Nota (opcional)</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            placeholder="Sin cebolla, extra salsa..."
                                            value={nota}
                                            onChange={(e) => setNota(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        className="btn btn-success btn-block btn-lg"
                                        onClick={handleSubmit}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <><i className="fas fa-spinner fa-spin mr-2" />Guardando...</>
                                        ) : (
                                            <><i className="fas fa-check mr-2" />Crear Pedido — S/ {total.toFixed(2)}</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default OrderCreateScreen;