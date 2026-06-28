const bcrypt = require("bcrypt");
const { client, now } = require("../drizzle/client");

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

async function seed() {
    for (const user of usersData) {
        const existing = await client.execute({
            sql: "SELECT id FROM Users WHERE email = ?",
            args: [user.email],
        });

        if (existing.rows.length > 0) {
            console.log(`User ${user.email} already exists, skipping.`);
        } else {
            await client.execute({
                sql: "INSERT INTO Users (name, email, password, isAdmin, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
                args: [
                    user.name,
                    user.email,
                    user.password,
                    user.isAdmin ? 1 : 0,
                    user.role,
                    now(),
                    now(),
                ],
            });
            console.log(`User ${user.email} created.`);
        }
    }

    console.log("Seed complete.");
    client.close();
}

seed().catch((err) => {
    console.error("Seed error:", err);
    process.exit(1);
});
