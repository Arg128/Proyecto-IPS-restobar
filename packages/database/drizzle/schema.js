const { sqliteTable, integer, text, real, primaryKey, uniqueIndex } = require("drizzle-orm/sqlite-core");
const { sql } = require("drizzle-orm");
const { relations } = require("drizzle-orm");

/* ========== Users ========== */
const users = sqliteTable("Users", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    image: text("image").notNull().default("/avatar.png"),
    isAdmin: integer("isAdmin", { mode: "boolean" }).notNull().default(false),
    role: text("role").notNull().default("USER"),
    createdAt: text("createdAt").notNull().default(sql`(datetime('now'))`),
    updatedAt: text("updatedAt").notNull().default(sql`(datetime('now'))`),
});

/* ========== Categories ========== */
const categories = sqliteTable("Categories", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    createdAt: text("createdAt").notNull().default(sql`(datetime('now'))`),
    updatedAt: text("updatedAt").notNull().default(sql`(datetime('now'))`),
});

/* ========== Products ========== */
const products = sqliteTable("Products", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    price: real("price").notNull(),
    stock: integer("stock").notNull().default(0),
    categoryId: integer("categoryId").notNull().references(() => categories.id, { onDelete: "SET NULL" }),
    createdAt: text("createdAt").notNull().default(sql`(datetime('now'))`),
    updatedAt: text("updatedAt").notNull().default(sql`(datetime('now'))`),
});

/* ========== Clients ========== */
const clients = sqliteTable("Clients", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    address: text("address").notNull(),
    phone: text("phone").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull().default(""),
    dni: text("dni").notNull(),
    createdAt: text("createdAt").notNull().default(sql`(datetime('now'))`),
    updatedAt: text("updatedAt").notNull().default(sql`(datetime('now'))`),
});

/* ========== Tables ========== */
const tables = sqliteTable("Tables", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    occupied: integer("occupied", { mode: "boolean" }).notNull().default(false),
    createdAt: text("createdAt").notNull().default(sql`(datetime('now'))`),
    updatedAt: text("updatedAt").notNull().default(sql`(datetime('now'))`),
});

/* ========== Orders ========== */
const orders = sqliteTable("Orders", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    total: real("total").notNull(),
    isPaid: integer("isPaid", { mode: "boolean" }).notNull().default(false),
    delivery: integer("delivery", { mode: "boolean" }).notNull().default(false),
    note: text("note"),
    userId: integer("userId").references(() => users.id, { onDelete: "SET NULL" }),
    clientId: integer("clientId").references(() => clients.id, { onDelete: "SET NULL" }),
    tableId: integer("tableId").references(() => tables.id, { onDelete: "SET NULL" }),
    createdAt: text("createdAt").notNull().default(sql`(datetime('now'))`),
    updatedAt: text("updatedAt").notNull().default(sql`(datetime('now'))`),
});

/* ========== OrderProduct (junction) ========== */
const orderProducts = sqliteTable("OrderProduct", {
    orderId: integer("orderId")
        .notNull()
        .references(() => orders.id, { onDelete: "CASCADE" }),
    productId: integer("productId")
        .notNull()
        .references(() => products.id, { onDelete: "CASCADE" }),
    quantity: integer("quantity").notNull().default(1),
}, (table) => ({
    pk: primaryKey({ columns: [table.orderId, table.productId] }),
}));

/* ========== EventosCoccion ========== */
const eventosCoccion = sqliteTable("eventos_coccion", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    productId: integer("productId").notNull().references(() => products.id, { onDelete: "CASCADE" }),
    nombre: text("nombre").notNull(),
    duracionSegundos: integer("duracionSegundos").notNull().default(0),
});

/* ========== Pagos ========== */
const pagos = sqliteTable("Pagos", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    monto: real("monto").notNull(),
    metodo_pago: text("metodo_pago").notNull().default("efectivo"),
    estado: text("estado").notNull().default("completado"),
    referencia: text("referencia"),
    orderId: integer("orderId").references(() => orders.id, { onDelete: "SET NULL" }),
    createdAt: text("createdAt").notNull().default(sql`(datetime('now'))`),
    updatedAt: text("updatedAt").notNull().default(sql`(datetime('now'))`),
});

/* ========== Facturas ========== */
const facturas = sqliteTable("Facturas", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    tipo: text("tipo").notNull().default("boleta"),
    numero: text("numero").notNull().unique(),
    cliente_nombre: text("cliente_nombre"),
    cliente_ruc: text("cliente_ruc"),
    subtotal: real("subtotal").notNull(),
    igv: real("igv").notNull(),
    total: real("total").notNull(),
    pago_id: integer("pago_id").notNull().references(() => pagos.id),
    createdAt: text("createdAt").notNull().default(sql`(datetime('now'))`),
    updatedAt: text("updatedAt").notNull().default(sql`(datetime('now'))`),
});

/* ========== Gastos ========== */
const gastos = sqliteTable("Gastos", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    descripcion: text("descripcion").notNull(),
    categoria: text("categoria").notNull(),
    monto: real("monto").notNull(),
    fecha: text("fecha").notNull().default(sql`(date('now'))`),
    comprobante: text("comprobante"),
    createdAt: text("createdAt").notNull().default(sql`(datetime('now'))`),
    updatedAt: text("updatedAt").notNull().default(sql`(datetime('now'))`),
});

/* ========== Pedidos (delivery) ========== */
const pedidos = sqliteTable("Pedidos", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    cliente: text("cliente").notNull(),
    direccion: text("direccion").notNull(),
    telefono: text("telefono").notNull(),
    nota: text("nota"),
    total: real("total").notNull(),
    estado: text("estado").notNull().default("Pendiente"),
    metodoPago: text("metodoPago"),
    isPaid: integer("isPaid", { mode: "boolean" }).notNull().default(false),
    productos: text("productos"),
    createdAt: text("createdAt").notNull().default(sql`(datetime('now'))`),
    updatedAt: text("updatedAt").notNull().default(sql`(datetime('now'))`),
});

/* ========== Recetas (ingredients) ========== */
const recetas = sqliteTable("recetas", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    productId: integer("productId").notNull().references(() => products.id, { onDelete: "CASCADE" }),
    ingrediente: text("ingrediente").notNull(),
    categoria: text("categoria").notNull().default("C"),
    cantidad: real("cantidad").notNull(),
    unidad_medida: text("unidad_medida").notNull(),
});

/* ========== TiemposCoccion ========== */
const tiemposCoccion = sqliteTable("tiempos_coccion", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    productId: integer("productId").notNull().unique().references(() => products.id, { onDelete: "CASCADE" }),
    principal: integer("principal").notNull().default(0),
    secundario: integer("secundario", { mode: "boolean" }).notNull().default(false),
});

/* ========== RELATIONS ========== */

const usersRelations = relations(users, ({ many }) => ({
    orders: many(orders),
}));

const categoriesRelations = relations(categories, ({ many }) => ({
    products: many(products),
}));

const productsRelations = relations(products, ({ one, many }) => ({
    category: one(categories, {
        fields: [products.categoryId],
        references: [categories.id],
    }),
    orderProducts: many(orderProducts),
    eventosCoccion: many(eventosCoccion),
    recetas: many(recetas),
    tiemposCoccion: one(tiemposCoccion),
}));

const clientsRelations = relations(clients, ({ many }) => ({
    orders: many(orders),
}));

const tablesRelations = relations(tables, ({ many }) => ({
    orders: many(orders),
}));

const ordersRelations = relations(orders, ({ one, many }) => ({
    user: one(users, {
        fields: [orders.userId],
        references: [users.id],
    }),
    client: one(clients, {
        fields: [orders.clientId],
        references: [clients.id],
    }),
    table: one(tables, {
        fields: [orders.tableId],
        references: [tables.id],
    }),
    orderProducts: many(orderProducts),
}));

const orderProductsRelations = relations(orderProducts, ({ one }) => ({
    order: one(orders, {
        fields: [orderProducts.orderId],
        references: [orders.id],
    }),
    product: one(products, {
        fields: [orderProducts.productId],
        references: [products.id],
    }),
}));

const eventosCoccionRelations = relations(eventosCoccion, ({ one }) => ({
    product: one(products, {
        fields: [eventosCoccion.productId],
        references: [products.id],
    }),
}));

const pagosRelations = relations(pagos, ({ one }) => ({
    factura: one(facturas),
    order: one(orders, {
        fields: [pagos.orderId],
        references: [orders.id],
    }),
}));

const facturasRelations = relations(facturas, ({ one }) => ({
    pago: one(pagos, {
        fields: [facturas.pago_id],
        references: [pagos.id],
    }),
}));

const recetasRelations = relations(recetas, ({ one }) => ({
    product: one(products, {
        fields: [recetas.productId],
        references: [products.id],
    }),
}));

const tiemposCoccionRelations = relations(tiemposCoccion, ({ one }) => ({
    product: one(products, {
        fields: [tiemposCoccion.productId],
        references: [products.id],
    }),
}));

module.exports = {
    users,
    categories,
    products,
    clients,
    tables,
    orders,
    orderProducts,
    eventosCoccion,
    pagos,
    facturas,
    gastos,
    pedidos,
    recetas,
    tiemposCoccion,

    usersRelations,
    categoriesRelations,
    productsRelations,
    clientsRelations,
    tablesRelations,
    ordersRelations,
    orderProductsRelations,
    eventosCoccionRelations,
    pagosRelations,
    facturasRelations,
    recetasRelations,
    tiemposCoccionRelations,
};
