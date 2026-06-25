const asyncHandler = require("express-async-handler");
const { Category } = require("../models");
const { Op } = require("sequelize");

exports.createCategory = asyncHandler(async (req, res) => {
    const name = req.body.name;
    const createdCategory = await Category.create({ name });
    res.status(201).json(createdCategory);
});

exports.getCategories = asyncHandler(async (req, res) => {
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
                ],
            },
        };
    }

    const count = await Category.count({ ...options });
    const categories = await Category.findAll({
        ...options,
    });

    res.json({ categories, page, pages: Math.ceil(count / pageSize) });
});

exports.getCategory = asyncHandler(async (req, res) => {
    const category = await Category.findByPk(req.params.id);

    if (category) {
        res.json(category);
    } else {
        res.status(404);
        throw new Error("Category not found");
    }
});

exports.updateCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;

    const category = await Category.findByPk(req.params.id);

    if (category) {
        category.name = name;
        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } else {
        res.status(404);
        throw new Error("Category not found");
    }
});

exports.deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findByPk(req.params.id);

    if (category) {
        await category.destroy();
        res.json({ message: "Category removed" });
    } else {
        res.status(404);
        throw new Error("Category not found");
    }
});
