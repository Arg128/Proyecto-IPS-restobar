const asyncHandler = require("express-async-handler");
const { User } = require("../models");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

exports.registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, isAdmin } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.scope("withPassword").create({
        name,
        email,
        password,
        isAdmin,
    });
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            image: user.image,
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.scope("withPassword").findOne({ where: { email } });

    if (user && (await user.validPassword(password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            role: user.role,
            image: user.image,
            token: generateToken(user.id),
        });
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

exports.getUser = asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.params.id);

    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

exports.getUsers = asyncHandler(async (req, res) => {
    const pageSize = 5;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword ? req.query.keyword : null;

    let options = {
        attributes: {
            exclude: ["updatedAt"],
        },
        offset: pageSize * (page - 1),
        limit: pageSize,
    };

    if (keyword) {
        options = {
            ...options,
            where: {
                [Op.or]: [
                    { id: { [Op.like]: `%${keyword}%` } },
                    { name: { [Op.like]: `%${keyword}%` } },
                    { email: { [Op.like]: `%${keyword}%` } },
                ],
            },
        };
    }

    const count = await User.count({});
    const users = await User.findAll({});

    res.json({ users, page, pages: Math.ceil(count / pageSize) });
});

exports.updateUser = asyncHandler(async (req, res) => {
    const { name, email, password, isAdmin, avatar } = req.body;

    const user = await User.findByPk(req.params.id);

    const salt = bcrypt.genSaltSync(10);

    if (user) {
        user.name = name;
        user.image = avatar ? "/avatar.png" : user.image;
        user.email = email;
        user.password = password
            ? bcrypt.hashSync(password, salt)
            : user.password;
        user.isAdmin = user.isAdmin
            ? user.isAdmin
            : isAdmin
            ? isAdmin
            : user.isAdmin;
        const updatedUser = await user.save();
        res.json(updatedUser);
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

exports.updateProfile = asyncHandler(async (req, res) => {
    const { id, name, email, password, passwordCheck, image } = req.body;

    const user = await User.scope("withPassword").findByPk(req.params.id);

    const salt = bcrypt.genSaltSync(10);

    if (user && (await user.validPassword(passwordCheck))) {
        user.name = name;
        user.email = email;
        user.image = image ? image : user.image;
        user.password = password
            ? bcrypt.hashSync(password, salt)
            : user.password;
        const updatedUser = await user.save();
        res.json(updatedUser);
    } else {
        res.status(404);
        throw new Error("Invalid Password");
    }
});

exports.deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.params.id);

    if (user) {
        await user.destroy();
        res.json({ message: "User removed" });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});
