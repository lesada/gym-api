import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { UserAlreadyExistsError } from "@/services/errors/user-already-exists";
import { RegisterService } from "@/services/register";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export const registerBodySchema = z.object({
	name: z.string(),
	email: z.string().email(),
	password: z.string().min(6),
});

export async function register(req: FastifyRequest, rep: FastifyReply) {
	const { name, email, password } = registerBodySchema.parse(req.body);
	try {
		const usersRepository = new PrismaUsersRepository();
		const registerService = new RegisterService(usersRepository);

		await registerService.execute({ name, email, password });
	} catch (error) {
		if (error instanceof UserAlreadyExistsError)
			return rep.status(409).send({ message: error.message });

		throw error;
	}

	return rep.status(201).send();
}
