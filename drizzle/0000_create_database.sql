CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(256) NOT NULL,
	"first_name" varchar(256) NOT NULL,
	"last_name" varchar(256),
	"password" text NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
