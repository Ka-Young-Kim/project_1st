import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  APP_PASSWORD: z.string().min(4),
  SESSION_SECRET: z.string().min(16),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  MARKET_DATA_CACHE_SECONDS: z.coerce.number().int().min(5).max(300).default(30),
  TWELVE_DATA_API_KEY: z.string().trim().min(1).optional(),
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  APP_PASSWORD: process.env.APP_PASSWORD,
  SESSION_SECRET: process.env.SESSION_SECRET,
  NODE_ENV: process.env.NODE_ENV,
  MARKET_DATA_CACHE_SECONDS: process.env.MARKET_DATA_CACHE_SECONDS,
  TWELVE_DATA_API_KEY: process.env.TWELVE_DATA_API_KEY,
});
