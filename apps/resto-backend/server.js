require("express-async-errors");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = "abc123";
}

const app = express();

app.use(cors({
    origin: true,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

/* ========== admin routes ========== */
app.use("/api/users", require("./routes/user"));
app.use("/api/categories", require("./routes/category"));
app.use("/api/products", require("./routes/product"));
app.use("/api/clients", require("./routes/client"));
app.use("/api/tables", require("./routes/table"));
app.use("/api/orders", require("./routes/order"));
if (!process.env.VERCEL) {
    app.use("/api/upload", require("./routes/upload"));
}

/* ========== cocina routes ========== */
// app.use("/api/coccion/users", require("./routes/coccion-user"));
app.use("/api/coccion/pedidos", require("./routes/coccion-pedidos"));
app.use("/api/coccion/tiempos", require("./routes/coccion-tiempos"));
app.use("/api/coccion/recetas", require("./routes/coccion-receta"));
app.use("/api/coccion/productos", require("./routes/productos"));

/* ========== caja routes ========== */
app.use("/api/caja/pagos", require("./routes/caja-pagos"));
app.use("/api/caja/facturas", require("./routes/caja-facturas"));
app.use("/api/caja/gastos", require("./routes/caja-gastos"));
app.use("/api/caja/estadisticas", require("./routes/caja-estadisticas"));

/* ========== delivery routes ========== */
app.use("/api/delivery/pedidos", require("./routes/delivery-pedidos"));

/* ========== health check ========== */
app.get("/", (req, res) => {
    res.send("Resto-Backend API is running...");
});

/* ========== uploads folder ========== */
if (!process.env.VERCEL) {
    const rootPath = path.resolve();
    app.use("/uploads", express.static(path.join(rootPath, "/uploads")));
}

/* ========== error handlers ========== */
app.use(notFound);
app.use(errorHandler);

/* ========== start server ========== */
const PORT = process.env.RESTO_BACKEND_PORT || process.env.PORT || 5000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Resto-backend server running on port ${PORT}`);
    });
}

module.exports = app;
