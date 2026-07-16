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
    }, []);

    if (loading) return <div>Cargando mesas...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: "12px",
                padding: "16px",
            }}
        >
            {tables.map((table) => (
                <div
                    key={table.id}
                    style={{
                        padding: "20px",
                        borderRadius: "8px",
                        textAlign: "center",
                        cursor: table.occupied ? "default" : "pointer",
                        backgroundColor: table.occupied ? "#e57373" : "#81c784",
                        color: "#fff",
                        fontWeight: "bold",
                    }}
                    onClick={() => {
                        if (!table.occupied) {
                            navigate(`/pedido/${table.id}`);
                        }
                    }}
                >
                    <div>{table.name}</div>
                    <div style={{ fontSize: "0.8em", marginTop: "6px" }}>
                        {table.occupied ? "Ocupada" : "Libre"}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MesasPage;