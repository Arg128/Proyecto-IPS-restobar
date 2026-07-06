import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Message } from "@restobar/ui";

const API = "/api/coccion/productos";

const config = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("userInfo")
            ? JSON.parse(localStorage.getItem("userInfo")).token
            : ""
            }`,
    },
});

const ProductosScreen = () => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState("");
    const [stock, setStock] = useState("");
    const [categoriaId, setCategoriaId] = useState("");

    const [nuevaCategoria, setNuevaCategoria] = useState("");
    const [csvFile, setCsvFile] = useState(null);
    const [importLoading, setImportLoading] = useState(false);
    const [modo, setModo] = useState("form");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const [resProd, resCat] = await Promise.all([
                axios.get(API, config()),
                axios.get(`${API}/categorias`, config()),
            ]);
            setProductos(resProd.data);
            setCategorias(resCat.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    const limpiarMensajes = () => {
        setError("");
        setSuccess("");
    };

    const handleCrearProducto = async (e) => {
        e.preventDefault();
        limpiarMensajes();
        if (!nombre || !precio || stock === "") {
            setError("Completa todos los campos obligatorios");
            return;
        }
        try {
            await axios.post("/api/products", {
                name: nombre,
                price: parseFloat(precio),
                stock: parseInt(stock) || 0,
                categoryId: categoriaId ? parseInt(categoriaId) : null,
            }, config());
            setSuccess("Producto creado correctamente");
            setNombre("");
            setPrecio("");
            setStock("");
            setCategoriaId("");
            cargarDatos();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    const handleCrearCategoria = async () => {
        limpiarMensajes();
        if (!nuevaCategoria.trim()) {
            setError("Escribe un nombre para la categoría");
            return;
        }
        try {
            const res = await axios.post("/api/categories", { name: nuevaCategoria.trim() }, config());
            setSuccess(`Categoría "${await res.data.name}" creada`);
            setNuevaCategoria("");
            setCategoriaId("");
            await cargarDatos();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    const handleEliminarCategoria = async (id) => {
        if (!window.confirm("¿Eliminar esta categoría?")) return;
        limpiarMensajes();
        try {
            await axios.delete(`/api/categories/${id}`, config());
            setSuccess("Categoría eliminada");
            if (categoriaId === String(id)) setCategoriaId("");
            await cargarDatos();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    const handleImportarCSV = async (e) => {
        e.preventDefault();
        limpiarMensajes();
        if (!csvFile) {
            setError("Selecciona un archivo CSV");
            return;
        }
        setImportLoading(true);
        try {
            const formData = new FormData();
            formData.append("archivo", csvFile);
            const { data } = await axios.post(`${API}/importar/csv`, formData, {
                ...config(),
                headers: { ...config().headers, "Content-Type": "multipart/form-data" },
            });
            setSuccess(data.message);
            setCsvFile(null);
            e.target.reset();
            cargarDatos();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setImportLoading(false);
        }
    };

    const handleEliminarProducto = async (id) => {
        if (!window.confirm("¿Eliminar este producto?")) return;
        try {
            await axios.delete(`/api/products/${id}`, config());
            cargarDatos();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    const renderFormulario = () => (
        <div className="card card-primary">
            <div className="card-header">
                <h3 className="card-title"><i className="fas fa-plus-circle" /> Crear Producto</h3>
            </div>
            <form onSubmit={handleCrearProducto} className="card-body">
                <div className="form-group">
                    <label>Nombre *</label>
                    <input type="text" className="form-control" value={nombre}
                        onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Lomo Saltado" />
                </div>
                <div className="form-group">
                    <label>Precio *</label>
                    <input type="number" step="0.01" className="form-control" value={precio}
                        onChange={(e) => setPrecio(e.target.value)} placeholder="0.00" />
                </div>
                <div className="form-group">
                    <label>Stock</label>
                    <input type="number" className="form-control" value={stock}
                        onChange={(e) => setStock(e.target.value)} placeholder="0" />
                </div>
                <div className="form-group">
                    <label>Categoría</label>
                    {categoriaId === "" ? (
                        <div className="input-group mb-2">
                            <input type="text" className="form-control" value={nuevaCategoria}
                                onChange={(e) => setNuevaCategoria(e.target.value)}
                                placeholder="Nombre de la nueva categoría" />
                            <div className="input-group-append">
                                <button type="button" className="btn btn-success" onClick={handleCrearCategoria}>
                                    <i className="fas fa-check" />
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={() => setCategoriaId("")}>
                                    <i className="fas fa-times" />
                                </button>
                            </div>
                        </div>
                    ) : null}
                    <div className="dropdown" ref={dropdownRef}>
                        <button className="form-control dropdown-toggle text-left" type="button"
                            onClick={() => setDropdownOpen(!dropdownOpen)}>
                            {categoriaId
                                ? categorias.find(c => c.id === parseInt(categoriaId))?.name
                                : "Crear una categoría"}
                        </button>
                        {dropdownOpen && (
                            <div className="dropdown-menu show" style={{ width: "100%", maxHeight: "250px", overflowY: "auto" }}>
                                <button className="dropdown-item" type="button"
                                    onClick={() => { setCategoriaId(""); setDropdownOpen(false); }}>
                                    Crear una categoría
                                </button>
                                {categorias.map(cat => (
                                    <div key={cat.id} className="dropdown-item d-flex justify-content-between align-items-center px-3">
                                        <span style={{ cursor: "pointer", flex: 1 }}
                                            onClick={() => { setCategoriaId(String(cat.id)); setDropdownOpen(false); }}>
                                            {cat.name}
                                        </span>
                                        <button className="btn btn-sm btn-danger ml-2" type="button"
                                            onClick={(e) => { e.stopPropagation(); handleEliminarCategoria(cat.id); }}>
                                            <i className="fas fa-times" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <button type="submit" className="btn btn-primary btn-block">
                    <i className="fas fa-save" /> Guardar Producto
                </button>
            </form>
        </div>
    );

    const renderCSVUpload = () => (
        <div className="card card-info">
            <div className="card-header">
                <h3 className="card-title"><i className="fas fa-file-csv" /> Importar CSV</h3>
            </div>
            <form onSubmit={handleImportarCSV} className="card-body">
                <p className="text-muted small">
                    El CSV debe tener las columnas: <code>nombre, precio, stock, categoria</code>
                </p>
                <div className="form-group">
                    <div className="custom-file">
                        <input type="file" className="custom-file-input" id="csvFile"
                            accept=".csv" onChange={(e) => setCsvFile(e.target.files[0])} />
                        <label className="custom-file-label" htmlFor="csvFile">
                            {csvFile ? csvFile.name : "Seleccionar archivo..."}
                        </label>
                    </div>
                </div>
                <button type="submit" className="btn btn-info btn-block" disabled={importLoading}>
                    {importLoading ? (
                        <><i className="fas fa-spinner fa-spin" /> Importando...</>
                    ) : (
                        <><i className="fas fa-upload" /> Subir CSV</>
                    )}
                </button>
            </form>
        </div>
    );

    const renderProductosTable = () => (
        <div className="card">
            <div className="card-header">
                <h3 className="card-title"><i className="fas fa-box" /> Productos ({productos.length})</h3>
            </div>
            <div className="card-body table-responsive p-0">
                {productos.length === 0 ? (
                    <p className="text-muted p-3">No hay productos registrados</p>
                ) : (
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Categoría</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.name}</td>
                                    <td>S/ {p.price.toFixed(2)}</td>
                                    <td>{p.stock}</td>
                                    <td>{p.category?.name || <span className="text-muted">—</span>}</td>
                                    <td>
                                        <button className="btn btn-danger btn-sm"
                                            onClick={() => handleEliminarProducto(p.id)}>
                                            <i className="fas fa-trash" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );

    return (
        <div className="wrapper">
            <nav className="main-header navbar navbar-expand navbar-white navbar-light">
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <div className="btn-group" role="group">
                            <button className={`btn ${modo === "form" ? "btn-primary" : "btn-outline-primary"}`}
                                onClick={() => setModo("form")}>
                                <i className="fas fa-plus-circle" /> Crear
                            </button>
                            <button className={`btn ${modo === "csv" ? "btn-info" : "btn-outline-info"}`}
                                onClick={() => setModo("csv")}>
                                <i className="fas fa-file-csv" /> Importar CSV
                            </button>
                        </div>
                    </li>
                    <li className="nav-item ml-2">
                        <Link to="/" className="nav-link btn btn-outline-secondary">
                            <i className="fas fa-arrow-left" /> Volver
                        </Link>
                    </li>
                </ul>
            </nav>

            <div className="content-wrapper" style={{ marginLeft: 0 }}>
                <section className="content-header">
                    <div className="container-fluid">
                        <h1><i className="fas fa-boxes" /> Productos</h1>
                    </div>
                </section>

                <section className="content">
                    <div className="container-fluid">
                        {error && <Message message={error} color={"danger"} />}
                        {success && <Message message={success} color={"success"} />}

                        <div className="row">
                            <div className="col-12 col-lg-8">
                                {renderProductosTable()}
                            </div>
                            <div className="col-12 col-lg-4">
                                {modo === "form" ? renderFormulario() : renderCSVUpload()}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ProductosScreen;
