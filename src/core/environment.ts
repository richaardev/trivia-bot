import { z } from "zod";

const environmentSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("production"),

  DISCORD_CLIENT_TOKEN: z.string(),

  POSTGRES_HOST: z.string(),
  POSTGRES_USERNAME: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DATABASE: z.string(),
  POSTGRES_PORT: z.string().transform(Number),
});

export const environment = environmentSchema.parse(process.env);

export const isDevelopment = environment.NODE_ENV === "development";
