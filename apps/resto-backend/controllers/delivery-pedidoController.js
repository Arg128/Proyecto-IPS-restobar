const { Pedido } = require("../models");

const getPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.findAll({
            order: [["createdAt", "DESC"]],
        });
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPedidoById = async (req, res) => {
    try {
        const pedido = await Pedido.findByPk(req.params.id);
        if (!pedido) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }
        res.json(pedido);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createPedido = async (req, res) => {
    try {
        const { cliente, direccion, telefono, nota, total, productos } = req.body;

        const pedido = await Pedido.create({
            cliente,
            direccion,
            telefono,
            nota,
            total,
            productos,
            estado: "Pendiente",
            isPaid: false,
        });

        res.status(201).json(pedido);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateEstado = async (req, res) => {
    try {
        const pedido = await Pedido.findByPk(req.params.id);
        if (!pedido) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }
        pedido.estado = req.body.estado || pedido.estado;
        await pedido.save();
        res.json(pedido);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const pagarPedido = async (req, res) => {
    try {
        const pedido = await Pedido.findByPk(req.params.id);
        if (!pedido) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }
        pedido.isPaid = true;
        pedido.metodoPago = req.body.metodoPago || "efectivo";
        pedido.estado = "Entregado";
        await pedido.save();
        res.json(pedido);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPedidos,
    getPedidoById,
    createPedido,
    updateEstado,
    pagarPedido,
};
