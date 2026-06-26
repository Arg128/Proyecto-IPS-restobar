CREATE TABLE `Users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`image` text DEFAULT '/avatar.png' NOT NULL,
	`isAdmin` integer DEFAULT false NOT NULL,
	`role` text DEFAULT 'USER' NOT NULL,
	`createdAt` text DEFAULT (datetime('now')) NOT NULL,
	`updatedAt` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Users_email_unique` ON `Users` (`email`);--> statement-breakpoint
CREATE TABLE `Categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`createdAt` text DEFAULT (datetime('now')) NOT NULL,
	`updatedAt` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`price` real NOT NULL,
	`stock` integer DEFAULT 0 NOT NULL,
	`categoryId` integer,
	`createdAt` text DEFAULT (datetime('now')) NOT NULL,
	`updatedAt` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`categoryId`) REFERENCES `Categories`(`id`) ON UPDATE no action ON DELETE SET NULL
);
--> statement-breakpoint
CREATE TABLE `Clients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`address` text NOT NULL,
	`phone` text NOT NULL,
	`email` text NOT NULL,
	`dni` text NOT NULL,
	`createdAt` text DEFAULT (datetime('now')) NOT NULL,
	`updatedAt` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Tables` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`occupied` integer DEFAULT false NOT NULL,
	`createdAt` text DEFAULT (datetime('now')) NOT NULL,
	`updatedAt` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`total` real NOT NULL,
	`isPaid` integer DEFAULT false NOT NULL,
	`delivery` integer DEFAULT false NOT NULL,
	`note` text,
	`userId` integer,
	`clientId` integer,
	`tableId` integer,
	`createdAt` text DEFAULT (datetime('now')) NOT NULL,
	`updatedAt` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON UPDATE no action ON DELETE SET NULL,
	FOREIGN KEY (`clientId`) REFERENCES `Clients`(`id`) ON UPDATE no action ON DELETE SET NULL,
	FOREIGN KEY (`tableId`) REFERENCES `Tables`(`id`) ON UPDATE no action ON DELETE SET NULL
);
--> statement-breakpoint
CREATE TABLE `OrderProduct` (
	`orderId` integer NOT NULL,
	`productId` integer NOT NULL,
	`quantity` integer DEFAULT 1 NOT NULL,
	PRIMARY KEY(`orderId`, `productId`),
	FOREIGN KEY (`orderId`) REFERENCES `Orders`(`id`) ON UPDATE no action ON DELETE CASCADE,
	FOREIGN KEY (`productId`) REFERENCES `Products`(`id`) ON UPDATE no action ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `eventos_coccion` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`productId` integer NOT NULL,
	`nombre` text NOT NULL,
	`duracionSegundos` integer DEFAULT 0 NOT NULL,
	`orden` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`productId`) REFERENCES `Products`(`id`) ON UPDATE no action ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `Pagos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`monto` real NOT NULL,
	`metodo_pago` text DEFAULT 'efectivo' NOT NULL,
	`estado` text DEFAULT 'completado' NOT NULL,
	`referencia` text,
	`createdAt` text DEFAULT (datetime('now')) NOT NULL,
	`updatedAt` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Facturas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tipo` text DEFAULT 'boleta' NOT NULL,
	`numero` text NOT NULL,
	`cliente_nombre` text,
	`cliente_ruc` text,
	`subtotal` real NOT NULL,
	`igv` real NOT NULL,
	`total` real NOT NULL,
	`pago_id` integer NOT NULL,
	`createdAt` text DEFAULT (datetime('now')) NOT NULL,
	`updatedAt` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`pago_id`) REFERENCES `Pagos`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Facturas_numero_unique` ON `Facturas` (`numero`);--> statement-breakpoint
CREATE TABLE `Gastos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`descripcion` text NOT NULL,
	`categoria` text NOT NULL,
	`monto` real NOT NULL,
	`fecha` text DEFAULT (date('now')) NOT NULL,
	`comprobante` text,
	`createdAt` text DEFAULT (datetime('now')) NOT NULL,
	`updatedAt` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Pedidos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`cliente` text NOT NULL,
	`direccion` text NOT NULL,
	`telefono` text NOT NULL,
	`nota` text,
	`total` real NOT NULL,
	`estado` text DEFAULT 'Pendiente' NOT NULL,
	`metodoPago` text,
	`isPaid` integer DEFAULT false NOT NULL,
	`productos` text,
	`createdAt` text DEFAULT (datetime('now')) NOT NULL,
	`updatedAt` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `recetas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`productId` integer NOT NULL,
	`ingrediente` text NOT NULL,
	`categoria` text DEFAULT 'C' NOT NULL,
	`cantidad` real NOT NULL,
	`unidad_medida` text NOT NULL,
	FOREIGN KEY (`productId`) REFERENCES `Products`(`id`) ON UPDATE no action ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `tiempos_coccion` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`productId` integer NOT NULL,
	`principal` integer DEFAULT 0 NOT NULL,
	`secundario` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`productId`) REFERENCES `Products`(`id`) ON UPDATE no action ON DELETE CASCADE
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tiempos_coccion_productId_unique` ON `tiempos_coccion` (`productId`);