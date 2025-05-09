import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { AuthenticateService } from "@/services/authenticate";
import { InvalidCredentialsError } from "@/services/errors/invalid-credentials";
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
	const { email, password } = authenticateBodySchema.parse(request.body);

	try {
		const usersRepository = new PrismaUsersRepository();
		const authenticateSerAuthenticateService = new AuthenticateService(
			usersRepository,
		);

		await authenticateSerAuthenticateService.execute({
			email,
			password,
		});
	} catch (err) {
		if (err instanceof InvalidCredentialsError) {
			return reply.status(400).send();
		}

		throw err;
	}

	return reply.status(200).send();
}
