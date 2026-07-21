PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_Products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`price` real NOT NULL,
	`stock` integer DEFAULT 0 NOT NULL,
	`categoryId` integer NOT NULL,
	`createdAt` text DEFAULT (datetime('now')) NOT NULL,
	`updatedAt` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`categoryId`) REFERENCES `Categories`(`id`) ON UPDATE no action ON DELETE SET NULL
);
--> statement-breakpoint
INSERT INTO `__new_Products`("id", "name", "price", "stock", "categoryId", "createdAt", "updatedAt") SELECT "id", "name", "price", "stock", "categoryId", "createdAt", "updatedAt" FROM `Products`;--> statement-breakpoint
DROP TABLE `Products`;--> statement-breakpoint
ALTER TABLE `__new_Products` RENAME TO `Products`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `Clients` ADD `password` text DEFAULT '' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `Clients_email_unique` ON `Clients` (`email`);--> statement-breakpoint
ALTER TABLE `eventos_coccion` DROP COLUMN `orden`;