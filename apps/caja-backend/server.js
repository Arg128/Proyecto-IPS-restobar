const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

const pagoRoutes = require("./routes/pagoRoutes");
const facturaRoutes = require("./routes/facturaRoutes");
const gastoRoutes = require("./routes/gastoRoutes");
const estadisticaRoutes = require("./routes/estadisticaRoutes");

app.use("/api/caja/pagos", pagoRoutes);
app.use("/api/caja/facturas", facturaRoutes);
app.use("/api/caja/gastos", gastoRoutes);
app.use("/api/caja/estadisticas", estadisticaRoutes);

app.get("/api/caja", (req, res) => {
    res.json({ message: "Caja API is running" });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.CAJA_BACKEND_PORT || 5003;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Caja server running on port ${PORT}`);
    });
}

module.exports = app;
