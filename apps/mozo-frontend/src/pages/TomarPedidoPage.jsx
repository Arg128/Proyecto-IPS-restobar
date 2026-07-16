import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";

const TomarPedidoPage = () => {
    const { tableId } = useParams();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [cart, setCart] = useState({}); // { productId: quantity }
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

const fetchData = async () => {
    try {
        const [prodRes, catRes] = await Promise.all([
            api.get("/products?all=true"),
            api.get("/categories?all=true"),
        ]);

        console.log("PRODUCTOS:", prodRes.data);
        console.log("CATEGORIAS:", catRes.data);

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
                delivery: false,
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

    if (loading) return <div>Cargando productos...</div>;

    return (
        <div style={{ padding: "16px" }}>
            <h2>Mesa #{tableId}</h2>
            {error && <div style={{ color: "red" }}>{error}</div>}

            <input
                type="text"
                placeholder="Buscar producto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
            />

            <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ width: "100%", padding: "8px", marginBottom: "16px" }}
            >
                <option value="">Todas las categorías</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </select>

            <div style={{ display: "grid", gap: "8px" }}>
                {filteredProducts.map((product) => (
                    <div
                        key={product.id}
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #ddd", padding: "8px", borderRadius: "6px" }}
                    >
                        <div>
                            <div>{product.name}</div>
                            <div style={{ fontSize: "0.85em", color: "#666" }}>S/ {product.price}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <button onClick={() => updateQuantity(product.id, -1)}>-</button>
                            <span>{cart[product.id] || 0}</span>
                            <button onClick={() => updateQuantity(product.id, 1)}>+</button>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: "16px", borderTop: "1px solid #ccc", paddingTop: "16px" }}>
                <div><strong>Total: S/ {total.toFixed(2)}</strong></div>
                <button
                    onClick={handleSubmit}
                    disabled={submitting || cartItems.length === 0}
                    style={{ marginTop: "8px", padding: "10px 20px", backgroundColor: "#4caf50", color: "#fff", border: "none", borderRadius: "6px" }}
                >
                    {submitting ? "Enviando..." : "Confirmar pedido"}
                </button>
            </div>
        </div>
    );
};

export default TomarPedidoPage;