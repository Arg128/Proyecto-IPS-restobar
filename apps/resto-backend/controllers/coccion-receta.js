const { eq } = require("drizzle-orm");
const { db, recetas, products } = require("@restobar/database");
const csv = require("csv-parser");
const { Readable } = require("stream");

exports.obtenerRecetas = async (req, res) => {
    const result = await db.select().from(recetas).all();
    const withProduct = await Promise.all(
      result.map(async (r) => {
        // const prod = (await db.select().from(products).where(eq(products.id, Number(r.productId))).get());
        const prod = await db.select().from(products).where(eq(products.id, Number(r.productId))).get();
        console.log(prod);
        return { ...r, producto: prod || null };
    }));
    res.json(withProduct);
    console.log(result);
    // res.json(result);
};

exports.obtenerRecetaDeProducto = async (req, res) => {
    const result = await db.select().from(recetas).where(eq(recetas.productId, Number(req.params.productId))).all();
    const withProduct = result.map(r => {
        const prod = db.select().from(products).where(eq(products.id, r.productId)).get();
        return { ...r, producto: prod || null };
    });
    res.json(withProduct);
};

exports.guardarReceta = async (req, res) => {
    const { productId } = req.params;
    const { ingredientes } = req.body;

    const existing = db.select().from(recetas).where(eq(recetas.productId, Number(productId))).get();
    if (existing) {
        await db.delete(recetas).where(eq(recetas.productId, Number(productId))).run();
    }
    if (ingredientes && ingredientes.length > 0) {
        for (const ing of ingredientes) {
            await db.insert(recetas).values({
                productId: Number(productId),
                ingrediente: ing.ingrediente,
                cantidad: ing.cantidad,
                unidad_medida: ing.unidad_medida,
                categoria: "C",
            }).run();
        }
    }

    const creados = db.select().from(recetas).where(eq(recetas.productId, Number(productId))).all();
    res.json(creados);
};

exports.subirCSV = async (req, res) => {
    if (!req.file) {
        res.status(400).json({ message: "Debe subir un archivo CSV" });
        return;
    }

    const resultados = [];
    const errores = [];
    const stream = Readable.from(req.file.buffer.toString("utf-8").split("\n"));

    await new Promise((resolve, reject) => {
        let cabeceras = true;
        stream
            .pipe(csv({ headers: ["nombre", "categoria", "unidad_por_defecto"], skipLines: 0 }))
            .on("data", (row) => {
                if (cabeceras && row.nombre === "nombre") { cabeceras = false; return; }
                cabeceras = false;
                const nombre = row.nombre?.trim();
                if (!nombre) return;
                const categoria = ["A", "B", "C"].includes(row.categoria?.trim().toUpperCase())
                    ? row.categoria.trim().toUpperCase() : "C";
                const unidad = row.unidad_por_defecto?.trim() || null;
                resultados.push({ nombre, categoria, unidad_por_defecto: unidad });
            })
            .on("end", resolve)
            .on("error", reject);
    });

    const creados = [];
    for (const item of resultados) {
        try {
            const existing = db.select().from(recetas).where(eq(recetas.ingrediente, item.nombre)).get();
            if (existing) {
                await db.update(recetas).set({ categoria: item.categoria, unidad_medida: item.unidad_por_defecto })
                    .where(eq(recetas.id, existing.id)).run();
                creados.push({ ...existing, categoria: item.categoria, unidad_medida: item.unidad_por_defecto });
            } else {
                await db.insert(recetas).values({
                    productId: 0, ingrediente: item.nombre,
                    categoria: item.categoria, cantidad: 0,
                    unidad_medida: item.unidad_por_defecto || "",
                }).run();
                creados.push(item);
            }
        } catch (err) {
            errores.push({ nombre: item.nombre, error: err.message });
        }
    }

    res.json({
        message: `Procesados ${creados.length} ingredientes${errores.length > 0 ? `, ${errores.length} errores` : ""}`,
        ingredientes: creados,
        errores: errores.length > 0 ? errores : undefined,
    });
};
