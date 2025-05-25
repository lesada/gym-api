import { config } from "dotenv";
import path from "node:path";
import { z } from "zod";

const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";

config({ path: path.resolve(process.cwd(), envFile) });

const envSchema = z.object({
	NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
	JWT_SECRET: z.string(),
	PORT: z.coerce.number().default(3333),
	DATABASE_URL: z.string().url(),
});

const _env = envSchema.safeParse(process.env);

if (_env.error) {
	console.error(_env.error.format());
	throw new Error("Invalid environment variables 🚧");
}

export const env = _env.data;
