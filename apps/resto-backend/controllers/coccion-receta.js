const asyncHandler = require("express-async-handler");
const { Receta, Product } = require("../models");
const csv = require("csv-parser");
const { Readable } = require("stream");

exports.obtenerRecetas = asyncHandler(async (req, res) => {
    const recetas = await Receta.findAll({
        include: [{ model: Product, as: "producto" }],
        order: [["productId", "ASC"]],
    });
    res.json(recetas);
});

exports.obtenerRecetaDeProducto = asyncHandler(async (req, res) => {
    const recetas = await Receta.findAll({
        where: { productId: req.params.productId },
        include: [{ model: Product, as: "producto" }],
    });
    res.json(recetas);
});

exports.guardarReceta = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { ingredientes } = req.body;

    await Receta.destroy({ where: { productId } });

    if (ingredientes && ingredientes.length > 0) {
        const nuevos = ingredientes.map((ing) => ({
            productId: parseInt(productId),
            ingrediente: ing.ingrediente,
            cantidad: ing.cantidad,
            unidad: ing.unidad,
        }));
        await Receta.bulkCreate(nuevos);
    }

    const creados = await Receta.findAll({ where: { productId } });
    res.json(creados);
});

exports.subirCSV = asyncHandler(async (req, res) => {
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
                if (cabeceras && row.nombre === "nombre") {
                    cabeceras = false;
                    return;
                }
                cabeceras = false;
                const nombre = row.nombre?.trim();
                if (!nombre) return;
                const categoria = ["A", "B", "C"].includes(row.categoria?.trim().toUpperCase())
                    ? row.categoria.trim().toUpperCase()
                    : "C";
                const unidad = row.unidad_por_defecto?.trim() || null;
                resultados.push({ nombre, categoria, unidad_por_defecto: unidad });
            })
            .on("end", resolve)
            .on("error", reject);
    });
    const creados = [];
    for (const item of resultados) {
        try {
            const [ing, created] = await Receta.findOrCreate({
                where: { nombre: item.nombre },
                defaults: item,
            });
            if (!created) {
                await ing.update({ categoria: item.categoria, unidad_por_defecto: item.unidad_por_defecto });
            }
            creados.push(ing);
        } catch (err) {
            errores.push({ nombre: item.nombre, error: err.message });
        }
    }
    res.json({
        message: `Procesados ${creados.length} ingredientes${errores.length > 0 ? `, ${errores.length} errores` : ""}`,
        ingredientes: creados,
        errores: errores.length > 0 ? errores : undefined,
    });
});
