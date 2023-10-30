CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"answered_incorrect" integer DEFAULT 0 NOT NULL,
	"answers_correct" integer DEFAULT 0 NOT NULL
);
