const { eq, or, like, count } = require("drizzle-orm");
const { db, now, clients } = require("@restobar/database");

exports.createClient = async (req, res) => {
    const { name, address, phone, email, dni } = req.body;
    const created = db.insert(clients).values({
        name, address, phone, email, dni,
        createdAt: now(), updatedAt: now(),
    }).returning().get();
    res.status(201).json(created);
};

exports.getClients = async (req, res) => {
    const pageSize = 5;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword;

    let query = db.select().from(clients).limit(pageSize).offset(pageSize * (page - 1));
    let countQuery = db.select({ total: count() }).from(clients);

    if (keyword) {
        const pattern = `%${keyword}%`;
        const filter = or(
            like(clients.id, pattern), like(clients.name, pattern),
            like(clients.address, pattern), like(clients.phone, pattern),
            like(clients.email, pattern), like(clients.dni, pattern),
        );
        query = query.where(filter);
        countQuery = countQuery.where(filter);
    }

    const result = await query.all();
    const total = countQuery.get();

    res.json({ clients: result, page, pages: Math.ceil(total.total / pageSize) });
};

exports.getClient = async (req, res) => {
    const client = db.select().from(clients).where(eq(clients.id, Number(req.params.id))).get();

    if (client) {
        res.json(client);
    } else {
        res.status(404);
        throw new Error("Client not found");
    }
};

exports.updateClient = async (req, res) => {
    const { name, address, phone, email, dni } = req.body;
    const client = db.select().from(clients).where(eq(clients.id, Number(req.params.id))).get();

    if (client) {
        await db.update(clients).set({
            name: name || client.name, address: address || client.address,
            phone: phone || client.phone, email: email || client.email,
            dni: dni || client.dni, updatedAt: now(),
        }).where(eq(clients.id, Number(req.params.id))).run();
        const updated = db.select().from(clients).where(eq(clients.id, Number(req.params.id))).get();
        res.json(updated);
    } else {
        res.status(404);
        throw new Error("Client not found");
    }
};

exports.deleteClient = async (req, res) => {
    const client = db.select().from(clients).where(eq(clients.id, Number(req.params.id))).get();

    if (client) {
        await db.delete(clients).where(eq(clients.id, Number(req.params.id))).run();
        res.json({ message: "Client removed" });
    } else {
        res.status(404);
        throw new Error("Client not found");
    }
};
