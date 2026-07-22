import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";

const CLIENTE_MOSTRADOR_ID = 1; // id del cliente genérico de mostrador

const TomarPedidoPage = () => {
    const { tableId } = useParams();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [cart, setCart] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [note, setNote] = useState("");

    const fetchData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                api.get("/products?all=true"),
                api.get("/categories?all=true"),
            ]);
            setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);
            setCategories(Array.isArray(catRes.data) ? catRes.data : []);
        } catch (err) {
            console.error("Error cargando productos:", err);
            setError("No se pudieron cargar los productos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredProducts = products.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = !selectedCategory || p.categoryId === Number(selectedCategory);
        return matchesSearch && matchesCategory;
    });

    const updateQuantity = (productId, delta) => {
        setCart((prev) => {
            const current = prev[productId] || 0;
            const next = Math.max(0, current + delta);
            const updated = { ...prev, [productId]: next };
            if (next === 0) delete updated[productId];
            return updated;
        });
    };

    const cartItems = Object.entries(cart).map(([productId, quantity]) => {
        const product = products.find((p) => p.id === Number(productId));
        return { ...product, quantity };
    });

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleSubmit = async () => {
        if (cartItems.length === 0) return;
        setSubmitting(true);
        setError(null);
        try {
            await api.post("/orders", {
                total,
                tableId: Number(tableId),
                clientId: CLIENTE_MOSTRADOR_ID,
                delivery: false,
                    note: note.trim() || null,
                products: cartItems.map((item) => ({ id: item.id, quantity: item.quantity })),
            });
            navigate("/");
        } catch (err) {
            console.error("Error al crear la orden:", err);
            setError("No se pudo crear el pedido.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Cargando...</span>
                </div>
            </div>
        );
    }

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
                        <i className="fas fa-utensils mr-2" style={{ color: "#90caf9" }}></i>
                        Mesa #{tableId}
                    </h2>
                    <p className="mb-0" style={{ color: "#adb5bd" }}>
                        Selecciona los productos del pedido.
                    </p>
                </div>
                <button
                    className="btn btn-light"
                    onClick={() => navigate("/")}
                >
                    <i className="fas fa-arrow-left mr-1"></i>
                    Volver
                </button>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <div className="row mb-3">
                <div className="col-md-8 mb-2">
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text">
                                <i className="fas fa-search"></i>
                            </span>
                        </div>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar producto..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-md-4 mb-2">
                    <select
                        className="form-control"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">Todas las categorías</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="row">
                {filteredProducts.map((product) => {
                    const qty = cart[product.id] || 0;
                    return (
                        <div className="col-md-4 col-sm-6 mb-3" key={product.id}>
                            <div
                                className="card h-100"
                                style={{
                                    borderRadius: "8px",
                                    border: qty > 0 ? "2px solid #007bff" : "1px solid #dee2e6",
                                }}
                            >
                                <div className="card-body d-flex justify-content-between align-items-center">
                                    <div>
                                        <div className="font-weight-bold">{product.name}</div>
                                        <div className="text-muted">S/ {product.price}</div>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => updateQuantity(product.id, -1)}
                                        >
                                            <i className="fas fa-minus"></i>
                                        </button>
                                        <span className="mx-2 font-weight-bold">{qty}</span>
                                        <button
                                            className="btn btn-sm btn-outline-success"
                                            onClick={() => updateQuantity(product.id, 1)}
                                        >
                                            <i className="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="mb-3">
    <label className="font-weight-bold">
        <i className="fas fa-sticky-note mr-1"></i>
        Observaciones del pedido (opcional)
    </label>
    <textarea
        className="form-control"
        rows="2"
        placeholder="Ej: sin cebolla, alergia a maní, servir todo junto..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
    />
</div>
            {/* Barra de resumen fija abajo */}
            <div
                className="d-flex justify-content-between align-items-center p-3"
                style={{
                    position: "sticky",
                    bottom: 0,
                    backgroundColor: "#fff",
                    borderTop: "1px solid #dee2e6",
                    borderRadius: "8px",
                    boxShadow: "0 -2px 6px rgba(0,0,0,0.08)",
                }}
            >
                <div>
                    <span className="text-muted mr-2">Total:</span>
                    <strong style={{ fontSize: "1.2rem" }}>S/ {total.toFixed(2)}</strong>
                </div>
                <button
                    className="btn btn-success"
                    onClick={handleSubmit}
                    disabled={submitting || cartItems.length === 0}
                >
                    {submitting ? (
                        <>
                            <span className="spinner-border spinner-border-sm mr-2" role="status"></span>
                            Enviando...
                        </>
                    ) : (
                        <>
                            <i className="fas fa-check mr-1"></i>
                            Confirmar Pedido
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default TomarPedidoPage;