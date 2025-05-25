import type { FastifyInstance } from "fastify";
import {
	authenticate,
	authenticateBodySchema,
} from "./controllers/authenticate";
import { profile, profileResponseSchema } from "./controllers/profile";
import { register, registerBodySchema } from "./controllers/register";
import { verifyJWT } from "./middlewares/verify-jwt";

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

	// Authenticated routes
	app.get(
		"/me",
		{
			onRequest: [verifyJWT],
			schema: {
				tags: ["users"],
				response: {
					200: profileResponseSchema,
				},
				summary: "Get user profile",
			},
		},
		profile,
	);
}
