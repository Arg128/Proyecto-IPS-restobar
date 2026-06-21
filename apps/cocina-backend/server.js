const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const app = express();

app.use(cors({origin:`${process.env.HOST}:${process.env.COCINA_FRONTEND_PORT || 3001}`}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

const userRoutes = require("./routes/user");
const pedidosRoutes = require("./routes/pedidos");
const tiempoRoutes = require("./routes/tiempo");
const recetaRoutes = require("./routes/receta");
app.use("/api/coccion/users", userRoutes);
app.use("/api/coccion/pedidos", pedidosRoutes);
app.use("/api/coccion/tiempos", tiempoRoutes);
app.use("/api/coccion/recetas", recetaRoutes);

app.get("/api/coccion", cors({origin:`${process.env.HOST}:${process.env.COCINA_FRONTEND_PORT || 3001}`}), (req, res) => {
    res.json({ message: "Cocina API is running" });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.COCINA_BACKEND_PORT || 5001;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Cocina server running on port ${PORT}`);
    });
}

module.exports = app;
