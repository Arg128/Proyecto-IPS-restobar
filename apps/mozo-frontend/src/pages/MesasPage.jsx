import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";

const MesasPage = () => {
    const navigate = useNavigate();

    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTables = async () => {
        try {
            const { data } = await api.get("/tables/all");
            setTables(data);
        } catch (err) {
            console.error("Error al cargar mesas:", err);
            setError("No se pudieron cargar las mesas.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTables();
        const interval = setInterval(fetchTables, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Cargando...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger m-3" role="alert">
                {error}
            </div>
        );
    }

    const totalMesas = tables.length;
    const ocupadas = tables.filter((t) => t.occupied).length;
    const disponibles = totalMesas - ocupadas;
    const porcentajeOcupacion = totalMesas > 0 ? Math.round((ocupadas / totalMesas) * 100) : 0;

    return (
        <div className="p-3">
            <div
                className="mb-4 p-4 d-flex justify-content-between align-items-center"
                style={{
                    background: "linear-gradient(135deg, #343a40 0%, #23272b 100%)",
                    borderRadius: "10px",
                    color: "#fff",
                }}
            >
                <div>
                    <h2 className="mb-1" style={{ color: "#fff" }}>
                        <i className="fas fa-chair mr-2" style={{ color: "#90caf9" }}></i>
                        Panel de Mesas
                    </h2>
                    <p className="mb-0" style={{ color: "#adb5bd" }}>
                        Selecciona una mesa disponible para tomar el pedido.
                    </p>
                </div>
                <div className="d-none d-md-block text-right">
                    <div style={{ fontSize: "0.85rem", color: "#adb5bd" }}>Mozo - Restobar</div>
                </div>
            </div>

            {/* Tarjetas de resumen */}
<div className="row mb-4">
                <div className="col-md-4 mb-2">
                    <div
                        style={{
                            backgroundColor: "#17a2b8", color: "#fff", borderRadius: "10px",
                            padding: "18px 20px", boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                        }}
                    >
                        <div>
                            <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>Ocupación Total</div>
                            <h3 className="mb-0" style={{ color: "#fff" }}>{porcentajeOcupacion}%</h3>
                        </div>
                        <i className="fas fa-chart-pie fa-2x" style={{ opacity: 0.5 }}></i>
                    </div>
                </div>
                <div className="col-md-4 mb-2">
                    <div
                        style={{
                            backgroundColor: "#28a745", color: "#fff", borderRadius: "10px",
                            padding: "18px 20px", boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                        }}
                    >
                        <div>
                            <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>Mesas Disponibles</div>
                            <h3 className="mb-0" style={{ color: "#fff" }}>{disponibles}</h3>
                        </div>
                        <i className="fas fa-check-circle fa-2x" style={{ opacity: 0.5 }}></i>
                    </div>
                </div>
                <div className="col-md-4 mb-2">
                    <div
                        style={{
                            backgroundColor: "#dc3545", color: "#fff", borderRadius: "10px",
                            padding: "18px 20px", boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                        }}
                    >
                        <div>
                            <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>Mesas Ocupadas</div>
                            <h3 className="mb-0" style={{ color: "#fff" }}>{ocupadas}</h3>
                        </div>
                        <i className="fas fa-utensils fa-2x" style={{ opacity: 0.5 }}></i>
                    </div>
                </div>
            </div>

            {/* Grid de mesas */}
            <div className="row">
                {tables.map((table) => {
                    const isOccupied = table.occupied;
                    return (
                        <div className="col-md-3 col-sm-4 col-6 mb-3" key={table.id}>
                            <div
                                className="card h-100"
                                style={{
                                    borderRadius: "8px",
                                    overflow: "hidden",
                                    border: isOccupied ? "2px solid #6c757d" : "2px solid #007bff",
                                    cursor: isOccupied ? "default" : "pointer",
                                }}
                                onClick={() => {
                                    if (!isOccupied) navigate(`/pedido/${table.id}`);
                                }}
                            >
                                <div
                                    className="card-body text-center"
                                    style={{
                                        backgroundColor: isOccupied ? "#c2185b" : "#fff",
                                        color: isOccupied ? "#fff" : "#212529",
                                    }}
                                >
                                    <i
                                        className={isOccupied ? "fas fa-utensils fa-2x mb-2" : "fas fa-chair fa-2x mb-2"}
                                        style={{ color: isOccupied ? "#fff" : "#90caf9" }}
                                    ></i>
                                    <h5 className="mb-0">{table.name}</h5>
                                    <strong className={isOccupied ? "" : "text-success"}>
                                        {isOccupied ? "OCUPADA" : "DISPONIBLE"}
                                    </strong>
                                </div>
                                <div
                                    className="text-center py-2"
                                    style={{
                                        backgroundColor: isOccupied ? "#6c757d" : "#007bff",
                                        color: "#fff",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {isOccupied ? "Mesa Ocupada" : "Tomar Pedido"}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MesasPage;