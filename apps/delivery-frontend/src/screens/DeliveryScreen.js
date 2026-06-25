import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const DeliveryScreen = () => {
    const [keyword, setKeyword] = useState("");
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const { data } = await axios.get("/api/delivery/pedidos");
                setPedidos(data);
                setLoading(false);
            } catch (err) {
                setError("Error al cargar los pedidos");
                setLoading(false);
            }
        };
        fetchPedidos();
    }, []);

    const pedidosFiltrados = pedidos.filter((p) =>
        p.cliente.toLowerCase().includes(keyword.toLowerCase()) ||
        p.direccion.toLowerCase().includes(keyword.toLowerCase())
    );

    const totalPendientes = pedidos.filter(p => p.estado === "Pendiente").length;
    const totalEnCamino = pedidos.filter(p => p.estado === "En camino").length;

    return (
        <>
            <div className="content-header">
                <div className="container-fluid">
                    <h1 className="m-0">
                        <i className="fas fa-truck mr-2" />
                        Pedidos Delivery
                    </h1>
                </div>
            </div>

            <section className="content">
                <div className="container-fluid">

                    <div className="row mb-3">
                        <div className="col-12 col-sm-4">
                            <div className="small-box bg-warning">
                                <div className="inner">
                                    <h3>{totalPendientes}</h3>
                                    <p>Pendientes</p>
                                </div>
                                <div className="icon"><i className="fas fa-clock" /></div>
                            </div>
                        </div>
                        <div className="col-12 col-sm-4">
                            <div className="small-box bg-success">
                                <div className="inner">
                                    <h3>{totalEnCamino}</h3>
                                    <p>En Camino</p>
                                </div>
                                <div className="icon"><i className="fas fa-truck" /></div>
                            </div>
                        </div>
                        <div className="col-12 col-sm-4">
                            <div className="small-box bg-info">
                                <div className="inner">
                                    <h3>{pedidos.length}</h3>
                                    <p>Total Pedidos</p>
                                </div>
                                <div className="icon"><i className="fas fa-list" /></div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">
                                        <i className="fas fa-truck mr-2" />
                                        Pedidos Activos
                                    </h3>
                                    <div className="card-tools d-flex">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm mr-2"
                                            placeholder="Buscar cliente o direccion..."
                                            value={keyword}
                                            onChange={(e) => setKeyword(e.target.value)}
                                            style={{ width: "250px" }}
                                        />
                                        <Link to="/order/create" className="btn btn-success btn-sm">
                                            <i className="fas fa-plus mr-1" />
                                            Nuevo Pedido
                                        </Link>
                                    </div>
                                </div>
                                <div className="card-body table-responsive p-0">
                                    {loading ? (
                                        <p className="text-center py-3">Cargando pedidos...</p>
                                    ) : error ? (
                                        <div className="alert alert-danger mx-3 mt-2">{error}</div>
                                    ) : (
                                        <table className="table table-hover text-nowrap">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Cliente</th>
                                                    <th className="d-none d-sm-table-cell">Direccion</th>
                                                    <th className="d-none d-sm-table-cell">Telefono</th>
                                                    <th>Total</th>
                                                    <th>Estado</th>
                                                    <th>Accion</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pedidosFiltrados.length > 0 ? (
                                                    pedidosFiltrados.map((pedido) => (
                                                        <tr key={pedido.id}>
                                                            <td>{pedido.id}</td>
                                                            <td><i className="fas fa-user mr-1 text-muted" />{pedido.cliente}</td>
                                                            <td className="d-none d-sm-table-cell">
                                                                <i className="fas fa-map-marker-alt mr-1 text-muted" />{pedido.direccion}
                                                            </td>
                                                            <td className="d-none d-sm-table-cell">
                                                                <i className="fas fa-phone mr-1 text-muted" />{pedido.telefono}
                                                            </td>
                                                            <td>
                                                                <span className="badge badge-primary">
                                                                    S/ {parseFloat(pedido.total).toFixed(2)}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <span className={`badge ${pedido.estado === "En camino" ? "badge-success" : pedido.estado === "Entregado" ? "badge-info" : "badge-warning"}`}>
                                                                    {pedido.estado}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <Link to={`/order/${pedido.id}/view`} className="btn btn-info btn-sm">
                                                                    <i className="fas fa-eye mr-1" />Ver
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="7" className="text-center text-muted py-3">
                                                            No hay pedidos activos
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default DeliveryScreen;