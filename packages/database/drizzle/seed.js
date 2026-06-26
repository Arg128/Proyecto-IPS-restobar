const { eq } = require("drizzle-orm");
const bcrypt = require("bcrypt");
const { db, users } = require("../models");

const salt = bcrypt.genSaltSync(10);
const password = bcrypt.hashSync("123456", salt);

const usersData = [
    {
        name: "Regular User",
        email: "user@example.com",
        password,
        isAdmin: false,
        role: "USER",
    },
    {
        name: "Admin User",
        email: "admin@example.com",
        password,
        isAdmin: true,
        role: "ADMIN",
    },
];

for (const userData of usersData) {
    const existing = db.select().from(users).where(eq(users.email, userData.email)).get();

    if (existing) {
        console.log(`User ${userData.email} already exists, skipping.`);
    } else {
        db.insert(users).values(userData).run();
        console.log(`User ${userData.email} created.`);
    }
}

console.log("Seed complete.");
