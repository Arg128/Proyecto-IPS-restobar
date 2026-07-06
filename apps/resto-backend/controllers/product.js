const { eq, or, like, count } = require("drizzle-orm");
const { db, now, products, categories } = require("@restobar/database");

exports.createProduct = async (req, res) => {
    const { name, price, stock, categoryId } = req.body;
    const cat = db.select().from(categories).where(eq(categories.id, Number(categoryId))).get();

    if (cat) {
        const created = db.insert(products).values({
            name, price: Number(price), stock: stock || 0,
            categoryId: Number(categoryId), createdAt: now(), updatedAt: now(),
        }).returning().get();
        res.json(created);
    } else {
        res.status(404);
        throw new Error("Category not found");
    }
};

exports.getProducts = async (req, res) => {
    if (req.query.all === "true") {
        const result = await db.query.products.findMany({
            with: { category: true },
        });
        return res.json(result);
    }

    const pageSize = 5;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword;

    let query = db.select().from(products).limit(pageSize).offset(pageSize * (page - 1));
    let countQuery = db.select({ total: count() }).from(products);

    if (keyword) {
        const pattern = `%${keyword}%`;
        const filter = or(like(products.name, pattern), like(products.id, pattern));
        query = query.where(filter);
        countQuery = countQuery.where(filter);
    }

    const result = await query.all();
    const total = countQuery.get();

    const withCategory = result.map(p => {
        const cat = p.categoryId ? db.select().from(categories).where(eq(categories.id, p.categoryId)).get() : null;
        return { ...p, category: cat || null };
    });

    res.json({ products: withCategory, page, pages: Math.ceil(total.total / pageSize) });
};

exports.getProduct = async (req, res) => {
    const product = db.select().from(products).where(eq(products.id, Number(req.params.id))).get();

    if (product) {
        const cat = product.categoryId ? db.select().from(categories).where(eq(categories.id, product.categoryId)).get() : null;
        res.json({ ...product, category: cat || null });
    } else {
        res.status(404);
        throw new Error("Product not found");
    }
};

exports.updateProduct = async (req, res) => {
    const { name, price, stock, category } = req.body;
    const product = db.select().from(products).where(eq(products.id, Number(req.params.id))).get();

    if (product) {
        await db.update(products).set({
            name: name || product.name,
            price: price !== undefined ? Number(price) : product.price,
            stock: stock !== undefined ? stock : product.stock,
            categoryId: category !== undefined ? Number(category) : product.categoryId,
            updatedAt: now(),
        }).where(eq(products.id, Number(req.params.id))).run();
        const updated = db.select().from(products).where(eq(products.id, Number(req.params.id))).get();
        res.json(updated);
    } else {
        res.status(404);
        throw new Error("Product not found");
    }
};

exports.deleteProduct = async (req, res) => {
    const product = db.select().from(products).where(eq(products.id, Number(req.params.id))).get();

    if (product) {
        await db.delete(products).where(eq(products.id, Number(req.params.id))).run();
        res.json({ message: "Product removed" });
    } else {
        res.status(404);
        throw new Error("Product not found");
    }
};
