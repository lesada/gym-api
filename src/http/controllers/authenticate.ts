import { InvalidCredentialsError } from "@/services/errors/invalid-credentials";
import { makeAuthenticateService } from "@/services/factories/make-authenticate-service";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export const authenticateBodySchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

export async function authenticate(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	try {
		const { email, password } = authenticateBodySchema.parse(request.body);
		const authenticateService = makeAuthenticateService();
		await authenticateService.execute({
			email,
			password,
		});
	} catch (error) {
		if (error instanceof InvalidCredentialsError) {
			return reply.status(400).send();
		}

		if (error instanceof z.ZodError)
			return reply.status(400).send({ message: error.flatten().fieldErrors });

		if (error instanceof Error)
			return reply.status(400).send({ message: error.message });

		throw error;
	}

	return reply.status(200).send();
}
