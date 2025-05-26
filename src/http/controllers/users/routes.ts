import type { FastifyInstance } from "fastify";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { authenticate, authenticateBodySchema } from "./authenticate";
import { profile, profileResponseSchema } from "./profile";
import { register, registerBodySchema } from "./register";

export async function usersRoutes(app: FastifyInstance) {
	app.post(
		"/auth",
		{
			schema: {
				body: authenticateBodySchema,
				tags: ["users"],
				summary: "Login",
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
