"use strict";

const { db, now } = require("../drizzle/client");
const schema = require("../drizzle/schema");

module.exports = {
    db,
    now,
    ...schema,
};
