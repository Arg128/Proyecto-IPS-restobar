ALTER TABLE `Clients` ADD `password` text NOT NULL DEFAULT '';--> statement-breakpoint
CREATE UNIQUE INDEX `Clients_email_unique` ON `Clients` (`email`);
