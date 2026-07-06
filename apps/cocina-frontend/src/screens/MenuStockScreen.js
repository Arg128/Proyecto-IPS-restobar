import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Message } from "@restobar/ui";

const API = "/api/coccion/recetas";

const config = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("userInfo")
            ? JSON.parse(localStorage.getItem("userInfo")).token
            : ""
            }`,
    },
});

const MenuStockScreen = () => {
    const [recetas, setRecetas] = useState([]);
    const [productos, setProductos] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [ingredientes, setIngredientes] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const [resRecetas, resProductos] = await Promise.all([
                axios.get(API, config()),
                axios.get("/api/coccion/tiempos/productos", config()),
            ]);
            setRecetas(resRecetas.data);
            setProductos(resProductos.data);
            console.log(resRecetas.data);
            console.log(resProductos.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    const seleccionarProducto = (prod) => {
        setSelectedProduct(prod);
        const recetasProd = recetas.filter((r) => r.productId === prod.id);
        setIngredientes(
            recetasProd.length > 0
                ? recetasProd.map((r) => ({ ingrediente: r.ingrediente, cantidad: r.cantidad, unidad_medida: r.unidad_medida }))
                : [{ ingrediente: "", cantidad: "", unidad_medida: "" }]
        );
    };

    const agregarIngrediente = () => {
        setIngredientes([...ingredientes, { ingrediente: "", cantidad: "", unidad_medida: "" }]);
    };

    const cambiarIngrediente = (i, field, value) => {
        const nuevos = [...ingredientes];
        nuevos[i][field] = value;
        setIngredientes(nuevos);
    };

    const guardarReceta = async () => {
        if (!selectedProduct) return;
        try {
            await axios.put(`${API}/${selectedProduct.id}`, { ingredientes }, config());
            cargarDatos();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    const agruparRecetas = () => {
        const map = {};
        recetas.forEach((r) => {
            console.log(r);
            if (!map[r.productId]) map[r.productId] = { producto: r.producto, ingredientes: [] };
            map[r.productId].ingredientes.push(r);
        });
        return Object.values(map);
    };

    return (
        <div className="wrapper">
            <nav className="main-header navbar navbar-expand navbar-white navbar-light">
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <Link to="/" className="nav-link btn btn-outline-primary">
                            <i className="fas fa-arrow-left" /> Volver
                        </Link>
                    </li>
                </ul>
            </nav>

            <div className="content-wrapper" style={{ marginLeft: 0 }}>
                <section className="content-header">
                    <div className="container-fluid">
                        <h1><i className="fas fa-book" /> Menú y Stock de Provisiones</h1>
                    </div>
                </section>

                <section className="content">
                    <div className="container-fluid">
                        <Message message={error} color={"danger"} />

                        <div className="row">
                            <div className="col-12 col-lg-8">
                                <div className="card">
                                    <div className="card-header">
                                        <h3 className="card-title">Lista de platos y sus ingredientes</h3>
                                    </div>
                                    <div className="card-body">
                                        {agruparRecetas().length === 0 ? (
                                            <p className="text-muted">
                                                No hay recetas configuradas. Selecciona un producto para agregar ingredientes.
                                            </p>
                                        ) : (
                                            <table className="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>Plato</th>
                                                        <th>Ingredientes</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {agruparRecetas().map((grupo) => (
                                                        <tr key={grupo.producto?.id}>
                                                            <td className="font-weight-bold">{grupo.producto?.name}</td>
                                                            <td>
                                                                {grupo.ingredientes.map((ing, i) => (
                                                                    <span key={i} className="badge badge-info mr-1 mb-1">
                                                                        {ing.ingrediente}: {ing.cantidad} {ing.unidad_medida}
                                                                    </span>
                                                                ))}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-lg-4">
                                <div className="card card-primary">
                                    <div className="card-header">
                                        <h3 className="card-title">Configurar ingredientes</h3>
                                    </div>
                                    <div className="card-body">
                                        <div className="form-group">
                                            <label>Seleccionar plato</label>
                                            <select
                                                className="form-control"
                                                value={selectedProduct?.id || ""}
                                                onChange={(e) => {
                                                    const prod = productos.find((p) => p.id === parseInt(e.target.value));
                                                    seleccionarProducto(prod);
                                                }}
                                            >
                                                <option value="">Seleccionar...</option>
                                                {productos.map((p) => (
                                                    <option key={p.id} value={p.id}>{p.name} (stock: {p.stock})</option>
                                                ))}
                                            </select>
                                        </div>

                                        {selectedProduct && (
                                            <>
                                                <hr />
                                                <h6>Ingredientes para {selectedProduct.name}</h6>
                                                {ingredientes.map((ing, i) => (
                                                    <div key={i} className="mb-2 p-2 border rounded">
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-sm mb-1"
                                                            placeholder="Ingrediente"
                                                            value={ing.ingrediente}
                                                            onChange={(e) => cambiarIngrediente(i, "ingrediente", e.target.value)}
                                                        />
                                                        <div className="row">
                                                            <div className="col-6">
                                                                <input
                                                                    type="text"
                                                                    className="form-control form-control-sm"
                                                                    placeholder="Cantidad"
                                                                    value={ing.cantidad}
                                                                    onChange={(e) => cambiarIngrediente(i, "cantidad", e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="col-6">
                                                                <input
                                                                    type="text"
                                                                    className="form-control form-control-sm"
                                                                    placeholder="Unidad (kg, g, und)"
                                                                    value={ing.unidad_medida}
                                                                    onChange={(e) => cambiarIngrediente(i, "unidad_medida", e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="d-flex justify-content-between mt-2">
                                                    <button className="btn btn-outline-success btn-sm" onClick={agregarIngrediente}>
                                                        <i className="fas fa-plus" /> Agregar
                                                    </button>
                                                    <button className="btn btn-primary btn-sm" onClick={guardarReceta}>
                                                        <i className="fas fa-save" /> Guardar
                                                    </button>
                                                </div>
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

export default MenuStockScreen;
