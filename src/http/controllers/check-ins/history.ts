import { makeGetUserCheckInsHistoryService } from "@/services/factories/make-get-user-check-ins-history-service";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export const historyQuerySchema = z.object({
	page: z.coerce.number().min(1).default(1),
});

export const historyResponseSchema = z.object({
	checkIns: z.array(
		z.object({
			id: z.string(),
			created_at: z.coerce.date(),
			validated_at: z.coerce.date().nullable(),
			user_id: z.string(),
			gym_id: z.string(),
		}),
	),
});

export async function history(req: FastifyRequest, rep: FastifyReply) {
	const { page } = historyQuerySchema.parse(req.query);

	const historyService = makeGetUserCheckInsHistoryService();

	const { checkIns } = await historyService.execute({
		page,
		userId: req.user.sub,
	});

	return rep.status(200).send({
		checkIns,
	});
}
