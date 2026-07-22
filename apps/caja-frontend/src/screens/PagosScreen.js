import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listPagos, createPago, anularPago } from "../actions/pagoActions";
import { listPendingOrders } from "../actions/orderActions";

const PagosScreen = () => {
    const dispatch = useDispatch();
    const { pagos, loading } = useSelector((state) => state.pagoList);
    const { success } = useSelector((state) => state.pagoCreate);
    const { pendingOrders, loading: loadingPending } = useSelector((state) => state.orderPendingList);

    const [monto, setMonto] = useState("");
    const [metodoPago, setMetodoPago] = useState("efectivo");
    const [referencia, setReferencia] = useState("");
    const [orderId, setOrderId] = useState(null);

    useEffect(() => {
        dispatch(listPagos());
        dispatch(listPendingOrders());
    }, [dispatch, success]);

    const handleCobrar = (order) => {
        setOrderId(order.id);
        setMonto(order.total);
    };

    const handleCancelarSeleccion = () => {
        setOrderId(null);
        setMonto("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createPago({ monto, metodo_pago: metodoPago, referencia, orderId }));
        setMonto("");
        setReferencia("");
        setOrderId(null);
    };

    return (
        <div className="content-wrapper">
            <div className="content-header">
                <div className="container-fluid">
                    <h1 className="m-0">Gestión de Pagos</h1>
                </div>
            </div>
            <div className="content">
                <div className="container-fluid">

                    {/* Pedidos pendientes de cobro */}
                    <div className="row">
                        <div className="col-12">
                            <div className="card card-outline card-warning">
                                <div className="card-header">
                                    <h3 className="card-title">Pedidos Pendientes de Cobro</h3>
                                </div>
                                <div className="card-body table-responsive p-0">
                                    {loadingPending ? <p className="p-3">Cargando...</p> : (
                                        pendingOrders.length === 0 ? (
                                            <p className="p-3 text-muted mb-0">No hay pedidos pendientes.</p>
                                        ) : (
                                            <table className="table table-striped m-0">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Mesa</th>
                                                        <th>Mozo</th>
                                                        <th>Total</th>
                                                        <th>Acción</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {pendingOrders.map((order) => (
                                                        <tr key={order.id} className={orderId === order.id ? "table-success" : ""}>
                                                            <td>{order.id}</td>
                                                            <td>{order.tableName || "Delivery"}</td>
                                                            <td>{order.userName || "-"}</td>
                                                            <td>S/ {parseFloat(order.total).toFixed(2)}</td>
                                                            <td>
                                                                <button
                                                                    className="btn btn-sm btn-warning"
                                                                    onClick={() => handleCobrar(order)}
                                                                >
                                                                    Cobrar
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-4">
                            <div className="card">
                                <div className="card-header bg-success text-white">
                                    <h3 className="card-title">Registrar Pago</h3>
                                </div>
                                <div className="card-body">
                                    {orderId && (
                                        <div className="alert alert-info d-flex justify-content-between align-items-center">
                                            <span>Cobrando pedido #{orderId}</span>
                                            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={handleCancelarSeleccion}>
                                                Quitar
                                            </button>
                                        </div>
                                    )}
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <label>Monto (S/)</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={monto}
                                                onChange={(e) => setMonto(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Método de Pago</label>
                                            <select
                                                className="form-control"
                                                value={metodoPago}
                                                onChange={(e) => setMetodoPago(e.target.value)}
                                            >
                                                <option value="efectivo">Efectivo</option>
                                                <option value="tarjeta">Tarjeta</option>
                                                <option value="transferencia">Transferencia</option>
                                                <option value="yape">Yape</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Referencia (opcional)</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={referencia}
                                                onChange={(e) => setReferencia(e.target.value)}
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-success btn-block">
                                            Registrar Pago
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-8">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Lista de Pagos</h3>
                                </div>
                                <div className="card-body table-responsive">
                                    {loading ? <p>Cargando...</p> : (
                                        <table className="table table-bordered table-hover">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Monto</th>
                                                    <th>Método</th>
                                                    <th>Estado</th>
                                                    <th>Fecha</th>
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pagos && pagos.map((pago) => (
                                                    <tr key={pago.id}>
                                                        <td>{pago.id}</td>
                                                        <td>S/ {parseFloat(pago.monto).toFixed(2)}</td>
                                                        <td>{pago.metodo_pago}</td>
                                                        <td>
                                                            <span className={`badge badge-${pago.estado === "completado" ? "success" : pago.estado === "anulado" ? "danger" : "warning"}`}>
                                                                {pago.estado}
                                                            </span>
                                                        </td>
                                                        <td>{new Date(pago.createdAt).toLocaleDateString()}</td>
                                                        <td>
                                                            {pago.estado !== "anulado" && (
                                                                <button
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() => dispatch(anularPago(pago.id))}
                                                                >
                                                                    Anular
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PagosScreen;