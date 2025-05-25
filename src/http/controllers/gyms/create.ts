import { makeCreateGymService } from "@/services/factories/make-create-gym-service";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export const createGymBodySchema = z.object({
	title: z.string(),
	description: z.string().nullable(),
	phone: z.string().nullable(),
	latitude: z.number().refine((value) => {
		return Math.abs(value) <= 90;
	}),
	longitude: z.number().refine((value) => {
		return Math.abs(value) <= 180;
	}),
});

export async function createGym(req: FastifyRequest, rep: FastifyReply) {
	const { description, latitude, longitude, phone, title } =
		createGymBodySchema.parse(req.body);

	const createGymService = makeCreateGymService();

	await createGymService.execute({
		description,
		latitude,
		longitude,
		phone,
		title,
	});

	return rep.status(201).send();
}
