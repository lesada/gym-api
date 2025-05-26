import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		dir: "src",
		coverage: {
			reporter: ["text", "lcov"],
			reportsDirectory: "./coverage",
		},
		workspace: [
			{
				extends: true,
				test: {
					name: "unit",
					dir: "src/services/_tests",
				},
			},
			{
				extends: true,
				test: {
					name: "e2e",
					dir: "src/http/controllers",
					environment:
						"./prisma/vitest-environment-prisma/prisma-test-environment.ts",
				},
			},
		],
	},
});
