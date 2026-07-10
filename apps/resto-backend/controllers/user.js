const { eq, or, like } = require("drizzle-orm");
const bcrypt = require("bcrypt");
const { db, now, users } = require("@restobar/database");
const generateToken = require("../utils/generateToken");

exports.registerUser = async (req, res) => {
    const { name, email, password, isAdmin } = req.body;

    const existing = await db.select().from(users).where(eq(users.email, String(email))).get();
    if (existing) {
        res.status(400);
        throw new Error("User already exists");
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = db.insert(users).values({
        name,
        email,
        password: hashedPassword,
        isAdmin: isAdmin || false,
        createdAt: now(),
        updatedAt: now(),
    }).returning().get();

    res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        image: user.image,
    });
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    const user = await db.select().from(users).where(eq(users.email, email)).get();
    if (user && bcrypt.compareSync(password, user.password)) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            role: user.role,
            image: user.image,
            token: generateToken(user.id),
        });
    } else {
        res.status(401);
        next(new Error("Invalid email or password"));
    }
};

exports.getUser = async (req, res) => {
    const user = await db.select().from(users).where(eq(users.id, Number(req.params.id))).get();

    if (user) {
        const { password, ...safe } = user;
        res.json(safe);
    } else {
        res.status(404);
        throw new Error("User not found");
    }
};

exports.getUsers = async (req, res) => {
    const pageSize = 5;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword;

    let query = db.select().from(users).limit(pageSize).offset(pageSize * (page - 1));
    let countQuery = db.select({ count: require("drizzle-orm").count() }).from(users);

    if (keyword) {
        const pattern = `%${keyword}%`;
        const filter = or(like(users.name, pattern), like(users.email, pattern));
        query = query.where(filter);
        countQuery = countQuery.where(filter);
    }

    const result = await query.all();
    const total = await countQuery.get();

    res.json({ users: result, page, pages: Math.ceil(total.count / pageSize) });
};

exports.updateUser = async (req, res) => {
    const { name, email, password, isAdmin, avatar } = req.body;
    const user = db.select().from(users).where(eq(users.id, Number(req.params.id))).get();

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    const salt = bcrypt.genSaltSync(10);
    const updates = {
        name: name || user.name,
        email: email || user.email,
        image: avatar ? "/avatar.png" : user.image,
        password: password ? bcrypt.hashSync(password, salt) : user.password,
        isAdmin: isAdmin !== undefined ? isAdmin : user.isAdmin,
        updatedAt: now(),
    };

    await db.update(users).set(updates).where(eq(users.id, Number(req.params.id))).run();
    const updated = db.select().from(users).where(eq(users.id, Number(req.params.id))).get();
    res.json(updated);
};

exports.updateProfile = async (req, res) => {
    const { name, email, password, passwordCheck, image } = req.body;
    const user = db.select().from(users).where(eq(users.id, Number(req.params.id))).get();

    if (!user || !bcrypt.compareSync(passwordCheck, user.password)) {
        res.status(404);
        throw new Error("Invalid Password");
    }

    const salt = bcrypt.genSaltSync(10);
    const updates = {
        name: name || user.name,
        email: email || user.email,
        image: image || user.image,
        password: password ? bcrypt.hashSync(password, salt) : user.password,
        updatedAt: now(),
    };

    await db.update(users).set(updates).where(eq(users.id, Number(req.params.id))).run();
    const updated = db.select().from(users).where(eq(users.id, Number(req.params.id))).get();
    res.json(updated);
};

exports.deleteUser = async (req, res) => {
    const user = db.select().from(users).where(eq(users.id, Number(req.params.id))).get();

    if (user) {
        await db.delete(users).where(eq(users.id, Number(req.params.id))).run();
        res.json({ message: "User removed" });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
};
