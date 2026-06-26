import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Loader, Message, Alert } from "@restobar/ui";
import { fetchProductosConEventos, fetchPedidos } from "../actions/coccionActions";
import { logout } from "../actions/userActions";
import TarjetaProducto from "../components/TarjetaProducto";

let uid = 0;
const nextId = () => ++uid;

const CocinaScreen = () => {
    const dispatch = useDispatch();

    const ordenesPendientes = useSelector((state) => state.ordenesPendientes);

    const [colaLocal, setColaLocal] = useState([]);
    const [completados, setCompletados] = useState([]);
    const [successMsg, setSuccessMsg] = useState("");
    const intervalRef = useRef(null);
    const completadosLenRef = useRef(0);

    const notificar = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(""), 3000);
    };

    useEffect(() => {
        if (completados.length > completadosLenRef.current) {
            const nuevos = completados.slice(completadosLenRef.current);
            nuevos.forEach((item) => {
                if (item.producto) {
                    notificar(`${item.producto.name} — cocción terminada`);
                }
            });
        }
        completadosLenRef.current = completados.length;
    }, [completados]);

    useEffect(() => {
        dispatch(fetchProductosConEventos());
        dispatch(fetchPedidos());
        const interval = setInterval(() => {
            dispatch(fetchPedidos());
        }, 15000);
        return () => clearInterval(interval);
    }, [dispatch]);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setColaLocal((prev) =>
                prev
                    .map((item) => {
                        if (item.completado) return item;
                        const eventos = item.eventos.map((e) => {
                            if (e.completado) return e;
                            if (!e.activo) return e;
                            const restante = Math.max(0, e.restante - 1);
                            return { ...e, restante, completado: restante === 0 };
                        });
                        const activoIndex = eventos.findIndex((e) => e.activo);
                        if (activoIndex !== -1 && eventos[activoIndex].completado) {
                            const nextIndex = activoIndex + 1;
                            if (nextIndex < eventos.length) {
                                eventos[nextIndex] = { ...eventos[nextIndex], activo: true };
                            }
                        }
                        const completado = eventos.every((e) => e.completado);
                        return { ...item, eventos, completado };
                    })
                    .filter((item) => {
                        if (item.completado) {
                            setTimeout(() => {
                                setCompletados((prev) => [...prev, item]);
                            }, 0);
                            return false;
                        }
                        return true;
                    })
            );
        }, 1000);
        return () => clearInterval(intervalRef.current);
    }, []);

    const cocinarProducto = useCallback((orden, producto) => {
        const eventos = (producto.eventosCoccion || []).map((ev, i) => ({
            nombre: ev.nombre,
            duracionSegundos: ev.duracionSegundos,
            restante: ev.duracionSegundos,
            activo: i === 0,
            completado: false,
        }));
        if (eventos.length === 0) {
            setCompletados((prev) => [
                ...prev,
                { id: nextId(), orderId: orden.id, producto, eventos: [], completado: true },
            ]);
            notificar(`${producto.name} completado (sin eventos)`);
            return;
        }
        setColaLocal((prev) => [
            ...prev,
            { id: nextId(), orderId: orden.id, producto, eventos, completado: false },
        ]);
        notificar(`${producto.name} agregado a cocción`);
    }, []);

    const handleLogout = (e) => {
        e.preventDefault();
        dispatch(logout());
        window.location.reload();
    };

    const productosEnCola = new Set(
        [...colaLocal, ...completados].map((i) => `${i.orderId}-${i.producto?.id}`)
    );

    return (
        <div className="wrapper">
            <nav className="main-header navbar navbar-expand navbar-white navbar-light">
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <Link to="/config" className="nav-link btn btn-outline-secondary mr-2">
                            <i className="fas fa-cog" /> Config
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/menu" className="nav-link btn btn-outline-info">
                            <i className="fas fa-book" /> Menú
                        </Link>
                    </li>
                    <li className="nav-item ml-1">
                        <Link to="/productos" className="nav-link btn btn-outline-success">
                            <i className="fas fa-boxes" /> Productos
                        </Link>
                    </li>
                    <li className="nav-item">
                        <span
                            style={{ cursor: "pointer" }}
                            onClick={(e) => handleLogout(e)}
                            className="nav-link btn btn-outline-danger"
                            role="button"
                        >
                            <i className="fas fa-power-off" /> Salir
                        </span>
                    </li>
                </ul>
            </nav>

            <div className="content-wrapper" style={{ marginLeft: 0 , height: '100%'}}>
                <section className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1>
                                    <i className="fas fa-utensils" /> Cocina
                                </h1>
                            </div>
                        </div>
                    </div>
                </section>

                {successMsg && (
                    <section className="content" style={{ paddingBottom: 0 }}>
                        <div className="container-fluid">
                            <Message message={successMsg} color={"success"} />
                        </div>
                    </section>
                )}

                <section className="content">
                    <div className="container-fluid justify-space-evenly">
                        <div className="col mtb-19 ptb-10 justify-content-between">
                            <div className="col-12 col-lg-auto mb-3">
                                <div className="card card-info">
                                    <div className="card-header">
                                        <h3 className="card-title">
                                            <i className="fas fa-clipboard-list" /> Pedidos Pendientes
                                        </h3>
                                        <Loader variable={ordenesPendientes.loading} />
                                    </div>
                                    <div className="card-body">
                                        <Message message={ordenesPendientes.error} color={"danger"} />
                                        {ordenesPendientes.items?.length === 0 && !ordenesPendientes.loading ? (
                                            <p className="text-muted text-center">No hay pedidos</p>
                                        ) : (
                                            ordenesPendientes.items?.map((orden) => (
                                                <div key={orden.id} className="mb-3 p-2 border rounded">
                                                    <h6>
                                                        Orden #{orden.id}
                                                        {orden.tableId && (
                                                            <small className="ml-2 text-muted">
                                                                Mesa {orden.tableId}
                                                            </small>
                                                        )}
                                                    </h6>
                                                    {(orden.products || []).map((prod) => {
                                                        const key = `${orden.id}-${prod.id}`;
                                                        const yaEnCola = productosEnCola.has(key);
                                                        return (
                                                            <div
                                                                key={prod.id}
                                                                className="d-flex justify-content-between align-items-center mb-1"
                                                            >
                                                                <span>
                                                                    {prod.name}
                                                                    {prod.OrderProduct?.quantity > 1 && (
                                                                        <span className="badge badge-secondary ml-1">
                                                                            x{prod.OrderProduct.quantity}
                                                                        </span>
                                                                    )}
                                                                </span>
                                                                <button
                                                                    className={`btn btn-sm ${yaEnCola ? "btn-secondary" : "btn-success"}`}
                                                                    disabled={yaEnCola}
                                                                    onClick={() => cocinarProducto(orden, prod)}
                                                                >
                                                                    {yaEnCola ? "En cocina" : "Cocinar"}
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-lg-auto row-lg-3 mb-3">
                                    <div className="card card-warning">
                                    <div className="card-header">
                                        <h3 className="card-title">
                                            <i className="fas fa-fire" /> En Cocción
                                        </h3>
                                        <span className="float-right badge badge-warning">{colaLocal.length}</span>
                                    </div>
                                    <div className="card-body">
                                        {colaLocal.length === 0 ? (
                                            <p className="text-muted text-center">
                                                No hay alimentos en preparación
                                            </p>
                                        ) : (
                                            <div className="row">
                                                {colaLocal.map((item) => (
                                                    <div key={item.id} className="col-12 col-md-6 mb-3">
                                                        <TarjetaProducto item={item} />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-lg-auto mb-3">
                                    <div className="card card-success">
                                    <div className="card-header">
                                        <h3 className="card-title">
                                            <i className="fas fa-check-circle" /> Completados
                                        </h3>
                                        <span className="float-right badge badge-success">{completados.length}</span>
                                    </div>
                                    <div className="card-body">
                                        {completados.length === 0 ? (
                                            <p className="text-muted text-center">
                                                No hay alimentos terminados
                                            </p>
                                        ) : (
                                            <>
                                                <div className="mb-2">
                                                    <Alert>
                                                        {completados.length} producto(s) completado(s) — retírelos de la cocina
                                                    </Alert>
                                                </div>
                                                <ul className="products-list product-list-in-card">
                                                    {completados.map((item) => (
                                                        <li key={item.id} className="item">
                                                            <div className="product-info">
                                                                <span className="product-title">
                                                                    <i className="fas fa-check-circle text-success mr-1" />
                                                                    {item.producto?.name}
                                                                </span>
                                                                <span className="product-description">
                                                                    Orden #{item.orderId}
                                                                </span>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default CocinaScreen;
