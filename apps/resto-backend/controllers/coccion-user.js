const asyncHandler = require("express-async-handler");
const { User } = require("../models");
const generateToken = require("../utils/generateToken");

exports.loginCocina = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.scope("withPassword").findOne({
        where: { email },
    });

    if (!user) {
        res.status(401);
        throw new Error("Invalid email or password");
    }

    if (user.isAdmin) {
        res.status(403);
        throw new Error("Superusers cannot access the kitchen app");
    }

    if (!(await user.validPassword(password))) {
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
});
