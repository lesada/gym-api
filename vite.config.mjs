import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		coverage: {
			reporter: ["text", "lcov"],
			reportsDirectory: "./coverage",
			setupFiles: ["./src/setup-tests.ts"],
		},
	},
});
