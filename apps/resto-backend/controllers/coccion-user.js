const { eq } = require("drizzle-orm");
const bcrypt = require("bcrypt");
const { db, users } = require("@restobar/database");
const generateToken = require("../utils/generateToken");

exports.loginCocina = async (req, res) => {
    const { email, password } = req.body;

    const user = db.select().from(users).where(eq(users.email, email)).get();

    if (!user) {
        res.status(401);
        throw new Error("Invalid email or password");
    }

    if (user.isAdmin) {
        res.status(403);
        throw new Error("Superusers cannot access the kitchen app");
    }

    if (!bcrypt.compareSync(password, user.password)) {
        res.status(401);
        throw new Error("Invalid email or password");
    }

    res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        image: user.image,
        token: generateToken(user.id),
    });
};
