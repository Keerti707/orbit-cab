CREATE TABLE `profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`role` text DEFAULT 'rider' NOT NULL,
	`avatar` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `rides` (
	`id` text PRIMARY KEY NOT NULL,
	`rider_id` text NOT NULL,
	`driver_id` text,
	`pickup` text NOT NULL,
	`destination` text NOT NULL,
	`type` text NOT NULL,
	`fare` integer NOT NULL,
	`distance` real NOT NULL,
	`status` text DEFAULT 'requested' NOT NULL,
	`created` text NOT NULL,
	`rating` integer,
	`review` text,
	`payment` text DEFAULT 'cash' NOT NULL,
	`paid` integer DEFAULT 0 NOT NULL
);
