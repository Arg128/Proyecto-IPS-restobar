const jwt = require("jsonwebtoken");
const { eq } = require("drizzle-orm");
const { db, users } = require("@restobar/database");

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = db.select().from(users).where(eq(users.id, decoded.id)).get();
            if (!user) {
                res.status(401);
                throw new Error("Not authorized");
            }

            req.user = user;
            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized");
    }
};

exports.admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error("Not authorized, admin only");
    }
};
