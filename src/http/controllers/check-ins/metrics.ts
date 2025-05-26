import { makeGetUserMetricsService } from "@/services/factories/make-get-user-metrics-service";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function metrics(req: FastifyRequest, rep: FastifyReply) {
	const metricsService = makeGetUserMetricsService();

	const { checkInsCount } = await metricsService.execute({
		userId: req.user.sub,
	});

	return rep.status(200).send({
		checkInsCount,
	});
}
