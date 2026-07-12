const jwt = require("jsonwebtoken");
const { eq } = require("drizzle-orm");
const { db, users } = require("@restobar/database");

const setCorsHeaders = (req, res) => {
    const origin = req.headers.origin || "*";
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
};

exports.protect = async (req, res, next) => {
    setCorsHeaders(req, res);

    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        return res.sendStatus(204);
    }

    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await db.select().from(users).where(eq(users.id, decoded.id)).get();
            if (!user) {
                return res.status(401).json({ message: "Not authorized" });
            }

            req.user = user;
            return next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized" });
    }
};

exports.admin = (req, res, next) => {
    setCorsHeaders(req, res);
    console.log(req.user)
    let usuario = req.user;
    if (usuario && usuario.isAdmin) {
        next();
    } else {
        return res.status(401).json({ message: "Not authorized, admin only" });
    }
};
