import { prisma } from "@/lib/prisma";
import "dotenv/config";
import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import type { Environment } from "vitest/environments";

function generateDatabaseUrl(schema: string): string {
	const url = process.env.DATABASE_URL;

	if (!url) {
		throw new Error("DATABASE_URL environment variable is not set");
	}

	const dbUrl = new URL(url);

	dbUrl.searchParams.set("schema", schema);

	return dbUrl.toString();
}

export default (<Environment>{
	name: "prisma",
	transformMode: "ssr",
	async setup() {
		const schema = randomUUID();

		process.env.DATABASE_URL = generateDatabaseUrl(schema);

		execSync("pnpm prisma migrate deploy", { stdio: "inherit" }); //NOSONAR

		return {
			async teardown() {
				await prisma.$executeRawUnsafe(
					`DROP SCHEMA IF EXISTS "${schema}" CASCADE;`,
				);

				await prisma.$disconnect();
			},
		};
	},
});
