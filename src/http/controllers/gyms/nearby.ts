import { makeGetNearbyGymsService } from "@/services/factories/make-get-nearby-gyms-service";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export const nearbyGymsQuerySchema = z.object({
	latitude: z.number().refine((value) => {
		return Math.abs(value) <= 90;
	}),
	longitude: z.number().refine((value) => {
		return Math.abs(value) <= 180;
	}),
});

export async function nearbyGyms(req: FastifyRequest, rep: FastifyReply) {
	const { latitude, longitude } = nearbyGymsQuerySchema.parse(req.query);

	const nearbyGymsService = makeGetNearbyGymsService();

	const { gyms } = await nearbyGymsService.execute({
		userLatitude: latitude,
		userLongitude: longitude,
	});

	return rep.status(200).send({
		gyms,
	});
}
