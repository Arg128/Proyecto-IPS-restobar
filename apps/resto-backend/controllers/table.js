const { eq, or, like, count } = require("drizzle-orm");
const { db, now, tables } = require("@restobar/database");

exports.createTable = async (req, res) => {
    const { name } = req.body;
    const created = db.insert(tables).values({ name, createdAt: now(), updatedAt: now() }).returning().get();
    res.status(201).json(created);
};

exports.getTables = async (req, res) => {
    const pageSize = 5;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword;

    let query = db.select().from(tables).limit(pageSize).offset(pageSize * (page - 1));
    let countQuery = db.select({ total: count() }).from(tables);

    if (keyword) {
        const pattern = `%${keyword}%`;
        const filter = or(like(tables.id, pattern), like(tables.name, pattern));
        query = query.where(filter);
        countQuery = countQuery.where(filter);
    }

    const result = query.all();
    const total = countQuery.get();

    res.json({ tables: result, page, pages: Math.ceil(total.total / pageSize) });
};

exports.getAllTables = async (req, res) => {
    const result = db.select().from(tables).all();
    res.json(result);
};

exports.getTable = async (req, res) => {
    const table = db.select().from(tables).where(eq(tables.id, Number(req.params.id))).get();

    if (table) {
        res.json(table);
    } else {
        res.status(404);
        throw new Error("Table not found");
    }
};

exports.updateTable = async (req, res) => {
    const { name, occupied } = req.body;
    const table = db.select().from(tables).where(eq(tables.id, Number(req.params.id))).get();

    if (table) {
        db.update(tables).set({
            name: name !== undefined ? name : table.name,
            occupied: occupied !== undefined ? occupied : table.occupied,
            updatedAt: now(),
        }).where(eq(tables.id, Number(req.params.id))).run();
        const updated = db.select().from(tables).where(eq(tables.id, Number(req.params.id))).get();
        res.json(updated);
    } else {
        res.status(404);
        throw new Error("Table not found");
    }
};

exports.deleteTable = async (req, res) => {
    const table = db.select().from(tables).where(eq(tables.id, Number(req.params.id))).get();

    if (table) {
        db.delete(tables).where(eq(tables.id, Number(req.params.id))).run();
        res.json({ message: "Table removed" });
    } else {
        res.status(404);
        throw new Error("Table not found");
    }
};
