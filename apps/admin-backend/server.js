const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
const app = express();

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));

/* Routes import */
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const clientRoutes = require("./routes/client");
const tableRoutes = require("./routes/table");
const orderRoutes = require("./routes/order");
const uploadRoutes = require("./routes/upload");


app.use(cors({origin:`${process.env.HOST}:${process.env.ADMIN_FRONTEND_PORT || 3000}`}));
/* Routes */
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

const rootPath = path.resolve();

/* File folder */
if (!process.env.VERCEL) {
    app.use("/uploads", express.static(path.join(rootPath, "/uploads")));
}

if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
    app.use(express.static(path.join(rootPath, "/frontend/build")));

    app.get("*", (req, res) =>
        res.sendFile(path.resolve(rootPath, "frontend", "build", "index.html"))
    );
} else {
    app.get("/", (req, res) => {
        res.send("API is running...");
    });
}

/* Error Handlers */
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
    app.listen(PORT, console.log(`Server running on port ${PORT}`));
}

module.exports = app;
