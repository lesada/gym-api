import { UserAlreadyExistsError } from "@/services/errors/user-already-exists";
import { makeRegisterService } from "@/services/factories/make-register-service";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export const registerBodySchema = z.object({
	name: z.string(),
	email: z.string().email(),
	password: z.string().min(6),
});

export async function register(req: FastifyRequest, rep: FastifyReply) {
	try {
		const { name, email, password } = registerBodySchema.parse(req.body);
		const registerService = makeRegisterService();
		await registerService.execute({ name, email, password });
	} catch (error) {
		if (error instanceof UserAlreadyExistsError)
			return rep.status(409).send({ message: error.message });

		throw error;
	}

	return rep.status(201).send();
}
