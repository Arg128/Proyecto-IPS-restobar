const { createClient } = require("@libsql/client");
const { drizzle } = require("drizzle-orm/libsql");
const path = require("path");
const dotenv = require("dotenv");
const schema = require("./schema");

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const isProduction = process.env.NODE_ENV === "production";

let client;
if (isProduction && process.env.TURSO_DATABASE_URL) {
    client = createClient({
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
    });
} else {
    const dbPath = path.resolve(__dirname, "../../../database/database.db");
    client = createClient({
        url: `file:${dbPath}`,
    });
}

const db = drizzle(client, { schema, logger: process.env.NODE_ENV === "development" });

const now = () => new Date().toISOString();

const gracefulShutdown = async (signal) => {
    try {
        await client.end();
    } catch (err) {
        console.error(`Error closing DB on ${signal}:`, err.message);
    }
    process.exit(0);
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

module.exports = { db, client, now };
