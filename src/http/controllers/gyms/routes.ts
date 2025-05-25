import type { FastifyInstance } from "fastify";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { createGym, createGymBodySchema } from "./create";

export async function gymsRoutes(app: FastifyInstance) {
	app.addHook("onRequest", verifyJWT);

	app.post(
		"/create",
		{
			schema: {
				body: createGymBodySchema,
				tags: ["gyms"],
				summary: "Create Gym",
			},
		},
		createGym,
	);
}
