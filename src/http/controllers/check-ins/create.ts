import { makeCheckInService } from "@/services/factories/make-check-in-service";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export const createCheckInParamsSchema = z.object({
	gymId: z.string().uuid(),
});

export const createCheckInBodySchema = z.object({
	latitude: z.number().refine((value) => {
		return Math.abs(value) <= 90;
	}),
	longitude: z.number().refine((value) => {
		return Math.abs(value) <= 180;
	}),
});

export async function createCheckIn(req: FastifyRequest, rep: FastifyReply) {
	const { gymId } = createCheckInParamsSchema.parse(req.params);
	const { latitude, longitude } = createCheckInBodySchema.parse(req.body);

	const createCheckInService = makeCheckInService();

	await createCheckInService.execute({
		userId: req.user.sub,
		gymId,
		userLatitude: latitude,
		userLongitude: longitude,
	});

	return rep.status(201).send();
}
