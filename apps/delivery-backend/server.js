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

// Rutas
const pedidoRoutes = require("./routes/pedidos");
app.use("/api/delivery/pedidos", pedidoRoutes);

app.get("/api/delivery", (req, res) => {
    res.json({ message: "Delivery API is running" });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.DELIVERY_BACKEND_PORT || 5003;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Delivery server running on port ${PORT}`);
    });
}

module.exports = app;
