import { makeSearchGymsService } from "@/services/factories/make-search-gyms-service";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export const searchGymsQuerySchema = z.object({
	query: z.string(),
	page: z.coerce.number().min(1).default(1),
});

export async function searchGyms(req: FastifyRequest, rep: FastifyReply) {
	const { page, query } = searchGymsQuerySchema.parse(req.query);

	const searchGymsService = makeSearchGymsService();

	const { gyms } = await searchGymsService.execute({
		page,
		query,
	});

	return rep.status(200).send({
		gyms,
	});
}
