import { InferSelectModel } from "drizzle-orm";
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  answersIncorrect: integer("answered_incorrect").notNull().default(0),
  answersCorrect: integer("answers_correct").notNull().default(0),
});

export type SelectUsers = InferSelectModel<typeof users>;
