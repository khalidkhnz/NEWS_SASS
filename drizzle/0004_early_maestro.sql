CREATE TABLE `categoryPostMap` (
	`id` text PRIMARY KEY NOT NULL,
	`category` text,
	`post_id` text,
	FOREIGN KEY (`category`) REFERENCES `categories`(`category`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE no action
);
