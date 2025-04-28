import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { RegisterService } from "@/services/register";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function register(req: FastifyRequest, rep: FastifyReply) {
	const registerBodySchema = z.object({
		name: z.string(),
		email: z.string().email(),
		password: z.string().min(6),
	});

	const { name, email, password } = registerBodySchema.parse(req.body);
	try {
		const usersRepository = new PrismaUsersRepository();
		const registerService = new RegisterService(usersRepository);

		await registerService.execute({ name, email, password });
	} catch {
		return rep.status(409).send();
	}

	return rep.status(201).send();
}
