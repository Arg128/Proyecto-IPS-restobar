const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const isProduction = process.env.NODE_ENV === "production";

/** @type { import("drizzle-kit").Config } */
module.exports = {
    schema: "./drizzle/schema.js",
    out: "./drizzle/migrations",
    dialect: "turso",
    dbCredentials: {
        url: (isProduction && process.env.TURSO_DATABASE_URL)
            ? process.env.TURSO_DATABASE_URL
            : "file:../../database/database.db",
        ...(isProduction && process.env.TURSO_AUTH_TOKEN
            ? { authToken: process.env.TURSO_AUTH_TOKEN }
            : {}),
    },
};
