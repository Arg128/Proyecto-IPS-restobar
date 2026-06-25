const asyncHandler = require("express-async-handler");
const { Table, Order } = require("../models");
const { Op } = require("sequelize");

exports.createTable = asyncHandler(async (req, res) => {
    const name = req.body.name;
    const createdTable = await Table.create({ name });
    res.status(201).json(createdTable);
});

exports.getTables = asyncHandler(async (req, res) => {
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

    const count = await Table.count({ ...options });
    const tables = await Table.findAll({ ...options });

    res.json({ tables, page, pages: Math.ceil(count / pageSize) });
});

exports.getAllTables = asyncHandler(async (req, res) => {
    const tables = await Table.findAll({
        include: [
            {
                model: Order,
                as: "orders",
                limit: 1,
                order: [["id", "DESC"]],
            },
        ],
    });
    res.json(tables);
});

exports.getTable = asyncHandler(async (req, res) => {
    const table = await Table.findByPk(req.params.id);

    if (table) {
        res.json(table);
    } else {
        res.status(404);
        throw new Error("Table not found");
    }
});

exports.updateTable = asyncHandler(async (req, res) => {
    const { name, occupied } = req.body;

    const table = await Table.findByPk(req.params.id);

    if (table) {
        table.name = name;
        table.occupied = occupied;
        const updatedTable = await table.save();
        res.json(updatedTable);
    } else {
        res.status(404);
        throw new Error("Table not found");
    }
});

exports.deleteTable = asyncHandler(async (req, res) => {
    const table = await Table.findByPk(req.params.id);

    if (table) {
        await table.destroy();
        res.json({ message: "Table removed" });
    } else {
        res.status(404);
        throw new Error("Table not found");
    }
});
