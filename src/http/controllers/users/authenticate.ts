import { InvalidCredentialsError } from "@/services/errors/invalid-credentials";
import { makeAuthenticateService } from "@/services/factories/make-authenticate-service";
import type { FastifyReply, FastifyRequest } from "fastify";
import { ZodError, z } from "zod";

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
		const { user } = await authenticateService.execute({
			email,
			password,
		});

		const token = await reply.jwtSign(
			{
				role: user.role,
			},
			{
				sign: {
					sub: user.id,
				},
			},
		);

		const refreshToken = await reply.jwtSign(
			{ role: user.role },
			{
				sign: {
					sub: user.id,
					expiresIn: "7d",
				},
			},
		);

		return reply
			.status(200)
			.setCookie("refreshToken", refreshToken, {
				path: "/",
				secure: true,
				sameSite: true,
				httpOnly: true,
			})
			.send({ token });
	} catch (error) {
		if (error instanceof InvalidCredentialsError) {
			return reply.status(400).send();
		}

		if (error instanceof ZodError)
			return reply
				.status(400)
				.send({ message: error.format(), type: "validation" });

		throw error;
	}
}
