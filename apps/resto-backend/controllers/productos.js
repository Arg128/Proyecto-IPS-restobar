const { eq, like, or } = require("drizzle-orm");
const { db, now, products, categories } = require("@restobar/database");
const csv = require("csv-parser");
const { Readable } = require("stream");

exports.importarProductosCSV = async (req, res) => {
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
            .pipe(csv({ headers: ["nombre", "precio", "stock", "categoria"], skipLines: 0 }))
            .on("data", (row) => {
                if (cabeceras && row.nombre === "nombre") { cabeceras = false; return; }
                cabeceras = false;
                const nombre = row.nombre?.trim();
                if (!nombre) return;
                const precio = parseFloat(row.precio) || 0;
                const stock = parseInt(row.stock) || 0;
                const categoria = row.categoria?.trim() || "";
                resultados.push({ nombre, precio, stock, categoria });
            })
            .on("end", resolve)
            .on("error", reject);
    });

    const creados = [];
    for (const item of resultados) {
        try {
            let cat = null;
            if (item.categoria) {
                cat = db.select().from(categories).where(eq(categories.name, item.categoria)).get();
                if (!cat) {
                    cat = db.insert(categories).values({
                        name: item.categoria,
                        createdAt: now(), updatedAt: now(),
                    }).returning().get();
                }
            }

            const nuevo = db.insert(products).values({
                name: item.nombre,
                price: item.precio,
                stock: item.stock,
                categoryId: cat ? cat.id : null,
                createdAt: now(), updatedAt: now(),
            }).returning().get();

            creados.push({ ...nuevo, category: cat || null });
        } catch (err) {
            errores.push({ nombre: item.nombre, error: err.message });
        }
    }

    res.json({
        message: `Importados ${creados.length} producto(s) correctamente${errores.length > 0 ? `, ${errores.length} error(es)` : ""}`,
        productos: creados,
        errores: errores.length > 0 ? errores : undefined,
    });
};

exports.listarProductos = async (req, res) => {
    const result = await db.select().from(products).all();
    const withCategory = result.map(p => {
        const cat = p.categoryId ? db.select().from(categories).where(eq(categories.id, p.categoryId)).get() : null;
        return { ...p, category: cat || null };
    });
    res.json(withCategory);
};

exports.listarCategorias = async (req, res) => {
    const result = await db.select().from(categories).all();
    res.json(result);
};
