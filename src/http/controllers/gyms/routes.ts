import { verifyUserRole } from "@/http/middlewares/verify-user-role";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { createGym, createGymBodySchema } from "./create";
import { nearbyGyms, nearbyGymsQuerySchema } from "./nearby";
import { searchGyms, searchGymsQuerySchema } from "./search";

const gymsResponse = z.object({
	gyms: z.array(
		z.object({
			id: z.string(),
			title: z.string(),
			description: z.string().nullable(),
			phone: z.string().nullable(),
			latitude: z.coerce.number(),
			longitude: z.coerce.number(),
		}),
	),
});

export async function gymsRoutes(app: FastifyInstance) {
	app.addHook("onRequest", verifyJWT);

	app.post(
		"/create",
		{
			onRequest: [verifyUserRole("ADMIN")],
			schema: {
				body: createGymBodySchema,
				tags: ["gyms"],
				summary: "Create Gym",
			},
		},
		createGym,
	);

	app.get(
		"/search",
		{
			schema: {
				querystring: searchGymsQuerySchema,
				tags: ["gyms"],
				summary: "Search gyms",
				response: {
					200: gymsResponse,
				},
			},
		},
		searchGyms,
	);

	app.get(
		"/nearby",
		{
			schema: {
				querystring: nearbyGymsQuerySchema,
				tags: ["gyms"],
				summary: "Get nearby gyms",
				response: {
					200: gymsResponse,
				},
			},
		},
		nearbyGyms,
	);
}
