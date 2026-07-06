const { eq, or, like, count } = require("drizzle-orm");
const { db, now, categories, products } = require("@restobar/database");

exports.createCategory = async (req, res) => {
    const { name } = req.body;
    const created = await db.insert(categories).values({ name, createdAt: now(), updatedAt: now() }).returning().get();
    res.status(201).json(created);
};

exports.getCategories = async (req, res) => {
    if (req.query.all === "true") {
        const result = await db.select().from(categories).all();
        return res.json(result);
    }

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
        await db.update(categories).set({ name, updatedAt: now() }).where(eq(categories.id, Number(req.params.id))).run();
        const updated = db.select().from(categories).where(eq(categories.id, Number(req.params.id))).get();
        res.json(updated);
    } else {
        res.status(404);
        throw new Error("Category not found");
    }
};

exports.deleteCategory = async (req, res) => {
    const cat = db.select().from(categories).where(eq(categories.id, Number(req.params.id))).get();

    if (!cat) {
        res.status(404);
        throw new Error("Category not found");
    }

    const result = await db.select({ total: count() }).from(products)
        .where(eq(products.categoryId, Number(req.params.id))).all();
    const productCount = result[0]?.total || 0;
    
    if (productCount > 0) {
        res.status(400);
        throw new Error(`Cannot delete "${cat.name}": ${productCount} product(s) are using this category`);
    }

    await db.delete(categories).where(eq(categories.id, Number(req.params.id))).run();
    res.json({ message: "Category removed" });
};
