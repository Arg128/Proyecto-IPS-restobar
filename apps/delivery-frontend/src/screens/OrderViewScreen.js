import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const OrderViewScreen = ({ match, history }) => {
    const id = match && match.params ? match.params.id : 1;

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modal, setModal] = useState(false);
    const [metodoPago, setMetodoPago] = useState("tarjeta");
    const [pagoExitoso, setPagoExitoso] = useState(false);
    const [errorTarjeta, setErrorTarjeta] = useState("");
    const [tarjeta, setTarjeta] = useState({
        numero: "",
        nombre: "",
        expiracion: "",
        cvv: "",
    });

    useEffect(() => {
        const fetchPedido = async () => {
            try {
                const { data } = await axios.get(`/api/delivery/pedidos/${id}`);
                setOrder(data);
                setLoading(false);
            } catch (err) {
                setError("Error al cargar el pedido");
                setLoading(false);
            }
        };
        fetchPedido();
    }, [id]);

    const handlePago = async (e) => {
        e.preventDefault();
        if (metodoPago === "tarjeta") {
            if (!tarjeta.numero || !tarjeta.nombre || !tarjeta.expiracion || !tarjeta.cvv) {
                setErrorTarjeta("Completa todos los campos de la tarjeta.");
                return;
            }
            if (tarjeta.numero.length < 16) {
                setErrorTarjeta("El numero de tarjeta debe tener 16 digitos.");
                return;
            }
        }
        try {
            await axios.put(`/api/delivery/pedidos/${id}/pagar`, {
                metodoPago,
            });
            setErrorTarjeta("");
            setPagoExitoso(true);
            setModal(false);
            setOrder({ ...order, isPaid: true, estado: "Entregado" });
        } catch (err) {
            setErrorTarjeta("Error al procesar el pago.");
        }
    };

    if (loading) return <div className="content"><div className="container-fluid"><p>Cargando...</p></div></div>;
    if (error) return <div className="content"><div className="container-fluid"><div className="alert alert-danger">{error}</div></div></div>;
    if (!order) return null;

    const productos = typeof order.productos === "string" ? JSON.parse(order.productos) : order.productos || [];

    return (
        <>
            <div className="content-header">
                <div className="container-fluid">
                    <div className="d-flex align-items-center">
                        <Link to="/pedidos" className="btn btn-secondary btn-sm mr-3">
                            <i className="fas fa-arrow-left mr-1" /> Volver
                        </Link>
                        <h1 className="m-0">
                            <i className="fas fa-truck mr-2" />
                            Pedido #{order.id}
                        </h1>
                    </div>
                </div>
            </div>

            <section className="content">
                <div className="container-fluid">

                    {pagoExitoso && (
                        <div className="alert alert-success">
                            <i className="fas fa-check-circle mr-2" />
                            Pago procesado exitosamente!
                        </div>
                    )}

                    <div className="row">
                        <div className="col-12 col-md-8">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">
                                        <i className="fas fa-shopping-cart mr-2" />
                                        Productos del Pedido
                                    </h3>
                                </div>
                                <div className="card-body table-responsive p-0">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Producto</th>
                                                <th>Cantidad</th>
                                                <th>Precio</th>
                                                <th>Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {productos.map((p, i) => (
                                                <tr key={i}>
                                                    <td>{p.nombre}</td>
                                                    <td><span className="badge badge-primary">{p.cantidad}</span></td>
                                                    <td>S/ {parseFloat(p.precio).toFixed(2)}</td>
                                                    <td><span className="badge badge-success">S/ {(p.cantidad * p.precio).toFixed(2)}</span></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colSpan="3" className="text-right font-weight-bold">TOTAL:</td>
                                                <td><span className="badge badge-success" style={{ fontSize: "1rem" }}>S/ {parseFloat(order.total).toFixed(2)}</span></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-md-4">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">
                                        <i className="fas fa-user mr-2" />
                                        Info del Cliente
                                    </h3>
                                </div>
                                <div className="card-body">
                                    <p><i className="fas fa-user mr-2 text-muted" /><strong>{order.cliente}</strong></p>
                                    <p><i className="fas fa-map-marker-alt mr-2 text-muted" />{order.direccion}</p>
                                    <p><i className="fas fa-phone mr-2 text-muted" />{order.telefono}</p>
                                    {order.nota && <p><i className="fas fa-sticky-note mr-2 text-muted" />{order.nota}</p>}
                                    <hr />
                                    <p>Estado: <span className={`badge ${order.isPaid ? "badge-success" : "badge-warning"}`}>
                                        {order.isPaid ? "Pagado" : "Pendiente de pago"}
                                    </span></p>
                                </div>
                            </div>

                            {!order.isPaid && (
                                <div className="card">
                                    <div className="card-header bg-success text-white">
                                        <h3 className="card-title">Procesar Pago</h3>
                                    </div>
                                    <div className="card-body">
                                        <button
                                            className="btn btn-success btn-block btn-lg"
                                            onClick={() => setModal(true)}
                                        >
                                            <i className="fas fa-credit-card mr-2" />
                                            Pagar S/ {parseFloat(order.total).toFixed(2)}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {modal && (
                <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-success text-white">
                                <h4 className="modal-title">
                                    <i className="fas fa-credit-card mr-2" />
                                    Procesar Pago - S/ {parseFloat(order.total).toFixed(2)}
                                </h4>
                                <button className="close text-white" onClick={() => setModal(false)}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="row mb-4">
                                    <div className="col-12">
                                        <label className="font-weight-bold mb-2">Metodo de pago</label>
                                        <div className="d-flex" style={{ gap: "10px" }}>
                                            {["tarjeta", "efectivo", "transferencia"].map((metodo) => (
                                                <button
                                                    key={metodo}
                                                    onClick={() => setMetodoPago(metodo)}
                                                    className={`btn ${metodoPago === metodo ? "btn-primary" : "btn-outline-secondary"}`}
                                                >
                                                    <i className={`fas mr-2 ${metodo === "tarjeta" ? "fa-credit-card" : metodo === "efectivo" ? "fa-money-bill" : "fa-exchange-alt"}`} />
                                                    {metodo.charAt(0).toUpperCase() + metodo.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {metodoPago === "tarjeta" && (
                                    <div className="card card-outline card-primary">
                                        <div className="card-header" style={{ background: "#f8f9fa" }}>
                                            <h5 className="card-title">
                                                <i className="fas fa-credit-card mr-2 text-primary" />
                                                Datos de la Tarjeta
                                            </h5>
                                        </div>
                                        <div className="card-body">
                                            {errorTarjeta && (
                                                <div className="alert alert-danger">
                                                    <i className="fas fa-exclamation-circle mr-2" />
                                                    {errorTarjeta}
                                                </div>
                                            )}

                                            {/* Numero de tarjeta */}
                                            <div className="form-group">
                                                <label className="font-weight-bold">
                                                    <i className="fas fa-credit-card mr-1 text-muted" />
                                                    Numero de tarjeta
                                                </label>
                                                <div className="input-group">
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text"><i className="fas fa-credit-card" /></span>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-lg"
                                                        placeholder="1234  5678  9012  3456"
                                                        maxLength="16"
                                                        value={tarjeta.numero}
                                                        onChange={(e) => setTarjeta({ ...tarjeta, numero: e.target.value.replace(/\D/g, "") })}
                                                    />
                                                </div>
                                                <small className="text-muted">Ingresa los 16 digitos de tu tarjeta</small>
                                            </div>

                                            {/* Nombre */}
                                            <div className="form-group">
                                                <label className="font-weight-bold">
                                                    <i className="fas fa-user mr-1 text-muted" />
                                                    Nombre del titular
                                                </label>
                                                <div className="input-group">
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text"><i className="fas fa-user" /></span>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-lg"
                                                        placeholder="Igual como aparece en la tarjeta"
                                                        value={tarjeta.nombre}
                                                        onChange={(e) => setTarjeta({ ...tarjeta, nombre: e.target.value.toUpperCase() })}
                                                    />
                                                </div>
                                                <small className="text-muted">Escribe tu nombre tal como aparece en la tarjeta</small>
                                            </div>

                                            <div className="row">
                                                {/* Expiracion */}
                                                <div className="col-6">
                                                    <div className="form-group">
                                                        <label className="font-weight-bold">
                                                            <i className="fas fa-calendar mr-1 text-muted" />
                                                            Fecha de vencimiento
                                                        </label>
                                                        <div className="input-group">
                                                            <div className="input-group-prepend">
                                                                <span className="input-group-text"><i className="fas fa-calendar" /></span>
                                                            </div>
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-lg"
                                                                placeholder="MM/AA"
                                                                maxLength="5"
                                                                value={tarjeta.expiracion}
                                                                onChange={(e) => {
                                                                    let val = e.target.value.replace(/\D/g, "");
                                                                    if (val.length >= 2) val = val.slice(0,2) + "/" + val.slice(2);
                                                                    setTarjeta({ ...tarjeta, expiracion: val });
                                                                }}
                                                            />
                                                        </div>
                                                        <small className="text-muted">Mes y año de vencimiento</small>
                                                    </div>
                                                </div>

                                                {/* CVV */}
                                                <div className="col-6">
                                                    <div className="form-group">
                                                        <label className="font-weight-bold">
                                                            <i className="fas fa-lock mr-1 text-muted" />
                                                            CVV / CVC
                                                        </label>
                                                        <div className="input-group">
                                                            <div className="input-group-prepend">
                                                                <span className="input-group-text"><i className="fas fa-lock" /></span>
                                                            </div>
                                                            <input
                                                                type="password"
                                                                className="form-control form-control-lg"
                                                                placeholder="3 digitos"
                                                                maxLength="3"
                                                                value={tarjeta.cvv}
                                                                onChange={(e) => setTarjeta({ ...tarjeta, cvv: e.target.value.replace(/\D/g, "") })}
                                                            />
                                                        </div>
                                                        <small className="text-muted">Codigo de seguridad al reverso</small>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Preview tarjeta */}
                                            <div style={{
                                                background: "linear-gradient(135deg, #1a1a2e, #16213e)",
                                                borderRadius: "12px",
                                                padding: "20px",
                                                color: "white",
                                                marginTop: "10px"
                                            }}>
                                                <div className="d-flex justify-content-between mb-3">
                                                    <i className="fas fa-wifi" style={{ transform: "rotate(90deg)" }} />
                                                    <i className="fas fa-credit-card" style={{ fontSize: "2rem", opacity: 0.7 }} />
                                                </div>
                                                <p style={{ letterSpacing: "3px", fontSize: "1.1rem", marginBottom: "15px" }}>
                                                    {tarjeta.numero ? tarjeta.numero.replace(/(.{4})/g, "$1 ").trim() : "#### #### #### ####"}
                                                </p>
                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        <small style={{ opacity: 0.7 }}>TITULAR</small>
                                                        <p style={{ margin: 0 }}>{tarjeta.nombre || "NOMBRE APELLIDO"}</p>
                                                    </div>
                                                    <div>
                                                        <small style={{ opacity: 0.7 }}>VENCE</small>
                                                        <p style={{ margin: 0 }}>{tarjeta.expiracion || "MM/AA"}</p>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                )}

                                {metodoPago === "efectivo" && (
                                    <div className="alert alert-info">
                                        <i className="fas fa-money-bill mr-2" />
                                        El cliente pagara en efectivo. Total: <strong>S/ {parseFloat(order.total).toFixed(2)}</strong>
                                    </div>
                                )}

                                {metodoPago === "transferencia" && (
                                    <div className="alert alert-info">
                                        <i className="fas fa-exchange-alt mr-2" />
                                        El cliente realizara una transferencia. Total: <strong>S/ {parseFloat(order.total).toFixed(2)}</strong>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
                                <button className="btn btn-success" onClick={handlePago}>
                                    <i className="fas fa-check mr-2" />
                                    Confirmar Pago
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default OrderViewScreen;