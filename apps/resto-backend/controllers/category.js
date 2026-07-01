const { eq, or, like, count } = require("drizzle-orm");
const { db, now, categories } = require("@restobar/database");

exports.createCategory = async (req, res) => {
    const { name } = req.body;
    const created = db.insert(categories).values({ name, createdAt: now(), updatedAt: now() }).returning().get();
    res.status(201).json(created);
};

exports.getCategories = async (req, res) => {
    const pageSize = 5;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword;

    let query = db.select().from(categories).limit(pageSize).offset(pageSize * (page - 1));
    let countQuery = db.select({ total: count() }).from(categories);

    if (keyword) {
        const pattern = `%${keyword}%`;
        const filter = or(like(categories.id, pattern), like(categories.name, pattern));
        query = query.where(filter);
        countQuery = countQuery.where(filter);
    }

    const result = await query.all();
    const total = countQuery.get();

    res.json({ categories: result, page, pages: Math.ceil(total.total / pageSize) });
};

exports.getCategory = async (req, res) => {
    const cat = db.select().from(categories).where(eq(categories.id, Number(req.params.id))).get();

    if (cat) {
        res.json(cat);
    } else {
        res.status(404);
        throw new Error("Category not found");
    }
};

exports.updateCategory = async (req, res) => {
    const { name } = req.body;
    const cat = db.select().from(categories).where(eq(categories.id, Number(req.params.id))).get();

    if (cat) {
        db.update(categories).set({ name, updatedAt: now() }).where(eq(categories.id, Number(req.params.id))).run();
        const updated = db.select().from(categories).where(eq(categories.id, Number(req.params.id))).get();
        res.json(updated);
    } else {
        res.status(404);
        throw new Error("Category not found");
    }
};

exports.deleteCategory = async (req, res) => {
    const cat = db.select().from(categories).where(eq(categories.id, Number(req.params.id))).get();

    if (cat) {
        db.delete(categories).where(eq(categories.id, Number(req.params.id))).run();
        res.json({ message: "Category removed" });
    } else {
        res.status(404);
        throw new Error("Category not found");
    }
};
