import { verifyUserRole } from "@/http/middlewares/verify-user-role";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { verifyJWT } from "../../middlewares/verify-jwt";
import {
	createCheckIn,
	createCheckInBodySchema,
	createCheckInParamsSchema,
} from "./create";
import { history, historyQuerySchema, historyResponseSchema } from "./history";
import { metrics } from "./metrics";
import { validateCheckIn } from "./validate";

export async function checkInsRoutes(app: FastifyInstance) {
	app.addHook("onRequest", verifyJWT);

	app.post(
		"/:gymId",
		{
			schema: {
				params: createCheckInParamsSchema,
				body: createCheckInBodySchema,
				tags: ["check-ins"],
				summary: "Create Check-In",
			},
		},
		createCheckIn,
	);

	app.get(
		"/history",
		{
			schema: {
				tags: ["check-ins"],
				summary: "Get User Check-In History",
				querystring: historyQuerySchema,
				response: {
					200: historyResponseSchema,
				},
			},
		},
		history,
	);

	app.get(
		"/metrics",
		{
			schema: {
				tags: ["check-ins"],
				summary: "Get User Metrics",
				response: {
					200: z.object({
						checkInsCount: z.number(),
					}),
				},
			},
		},
		metrics,
	);

	app.patch(
		"/:checkInId/validate",
		{
			onRequest: [verifyUserRole("ADMIN")],
			schema: {
				params: z.object({
					checkInId: z.string().uuid(),
				}),
				tags: ["check-ins"],
				summary: "Validate Check-In",
			},
		},
		validateCheckIn,
	);
}
