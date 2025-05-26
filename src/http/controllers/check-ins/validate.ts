import { makeValidateCheckInService } from "@/services/factories/make-validate-check-in-service";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export const validateCheckInParamsSchema = z.object({
	checkInId: z.string().uuid(),
});

export async function validateCheckIn(req: FastifyRequest, rep: FastifyReply) {
	const { checkInId } = validateCheckInParamsSchema.parse(req.params);

	const validateCheckInService = makeValidateCheckInService();

	await validateCheckInService.execute({
		checkInId,
	});

	return rep.status(204).send();
}
