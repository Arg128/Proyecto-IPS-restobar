const { eq } = require("drizzle-orm");
const { db, tiemposCoccion, eventosCoccion, products } = require("@restobar/database");

exports.obtenerTiempos = async (req, res) => {
    const result = await db.select().from(tiemposCoccion).all();
    const withProduct = result.map(t => {
        const prod = t.productId ? db.select().from(products).where(eq(products.id, t.productId)).get() : null;
        return { ...t, producto: prod || null };
    });
    res.json(withProduct);
};

exports.actualizarTiempo = async (req, res) => {
    const { productId } = req.params;
    const { tiempoPromedio } = req.body;

    const existing = db.select().from(tiemposCoccion).where(eq(tiemposCoccion.productId, Number(productId))).get();

    if (existing) {
        db.update(tiemposCoccion).set({ principal: tiempoPromedio }).where(eq(tiemposCoccion.productId, Number(productId))).run();
    } else {
        db.insert(tiemposCoccion).values({ productId: Number(productId), principal: tiempoPromedio }).run();
    }

    const result = db.select().from(tiemposCoccion).where(eq(tiemposCoccion.productId, Number(productId))).get();
    res.json(result);
};

exports.obtenerEventosDeProducto = async (req, res) => {
    const result = await db.select().from(eventosCoccion).where(eq(eventosCoccion.productId, Number(req.params.productId))).orderBy(eventosCoccion.orden, "asc").all();
    res.json(result);
};

exports.configurarEventos = async (req, res) => {
    const { productId } = req.params;
    const { eventos } = req.body;

    db.delete(eventosCoccion).where(eq(eventosCoccion.productId, Number(productId))).run();

    if (eventos && eventos.length > 0) {
        for (let i = 0; i < eventos.length; i++) {
            db.insert(eventosCoccion).values({
                productId: Number(productId),
                nombre: eventos[i].nombre,
                duracionSegundos: eventos[i].duracionSegundos || 0,
                orden: i,
            }).run();
        }
    }

    const creados = await db.select().from(eventosCoccion).where(eq(eventosCoccion.productId, Number(productId))).orderBy(eventosCoccion.orden, "asc").all();
    res.json(creados);
};

exports.obtenerProductos = async (req, res) => {
    const result = await db.select().from(products).all();
    const withRelations = await Promise.all(result.map(async p => {
        const tc = db.select().from(tiemposCoccion).where(eq(tiemposCoccion.productId, p.id)).get() || null;
        const ev = await db.select().from(eventosCoccion).where(eq(eventosCoccion.productId, p.id)).orderBy(eventosCoccion.orden, "asc").all();
        return { ...p, tiemposCoccion: tc, eventosCoccion: ev };
    }));
    res.json(withRelations);
};
