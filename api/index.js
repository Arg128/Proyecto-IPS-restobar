const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
}

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/* ========== admin-backend routes ========== */
app.use("/api/users", require("../apps/admin-backend/routes/user"));
app.use("/api/categories", require("../apps/admin-backend/routes/category"));
app.use("/api/products", require("../apps/admin-backend/routes/product"));
app.use("/api/clients", require("../apps/admin-backend/routes/client"));
app.use("/api/tables", require("../apps/admin-backend/routes/table"));
app.use("/api/orders", require("../apps/admin-backend/routes/order"));
if (!process.env.VERCEL) {
  app.use("/api/upload", require("../apps/admin-backend/routes/upload"));
}

/* ========== cocina-backend routes ========== */
app.use("/api/coccion/users", require("../apps/cocina-backend/routes/user"));
app.use("/api/coccion/pedidos", require("../apps/cocina-backend/routes/pedidos"));
app.use("/api/coccion/tiempos", require("../apps/cocina-backend/routes/tiempo"));
app.use("/api/coccion/recetas", require("../apps/cocina-backend/routes/receta"));

/* ========== caja-backend routes ========== */
app.use("/api/caja/pagos", require("../apps/caja-backend/routes/pagoRoutes"));
app.use("/api/caja/facturas", require("../apps/caja-backend/routes/facturaRoutes"));
app.use("/api/caja/gastos", require("../apps/caja-backend/routes/gastoRoutes"));
app.use("/api/caja/estadisticas", require("../apps/caja-backend/routes/estadisticaRoutes"));

/* ========== delivery-backend routes ========== */
app.use("/api/delivery/pedidos", require("../apps/delivery-backend/routes/pedidos"));

/* ========== error handlers ========== */
const { notFound, errorHandler } = require("../apps/admin-backend/middleware/errorMiddleware");
app.use(notFound);
app.use(errorHandler);

module.exports = app;
