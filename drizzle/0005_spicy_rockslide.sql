PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_categoryPostMap` (
	`category` text NOT NULL,
	`post_id` text NOT NULL,
	PRIMARY KEY(`category`, `post_id`),
	FOREIGN KEY (`category`) REFERENCES `categories`(`category`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_categoryPostMap`("category", "post_id") SELECT "category", "post_id" FROM `categoryPostMap`;--> statement-breakpoint
DROP TABLE `categoryPostMap`;--> statement-breakpoint
ALTER TABLE `__new_categoryPostMap` RENAME TO `categoryPostMap`;--> statement-breakpoint
PRAGMA foreign_keys=ON;