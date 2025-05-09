import type { FastifyInstance } from "fastify";
import {
	authenticate,
	authenticateBodySchema,
} from "./controllers/authenticate";
import { register, registerBodySchema } from "./controllers/register";

export async function appRoutes(app: FastifyInstance) {
	app.post(
		"/auth",
		{
			schema: {
				body: authenticateBodySchema,
				tags: ["users"],
			},
		},
		authenticate,
	);

	app.post(
		"/users",
		{
			schema: {
				body: registerBodySchema,
				tags: ["users"],
				summary: "Register a new user",
			},
		},
		register,
	);
}
