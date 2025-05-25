import { makeGetUserProfileService } from "@/services/factories/make-get-user-profile-service";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export const profileBodySchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

export async function profile(request: FastifyRequest, reply: FastifyReply) {
	await request.jwtVerify();

	const getUserProfile = makeGetUserProfileService();

	const { user } = await getUserProfile.execute({
		userId: request.user.sub,
	});

	if (!user) {
		return reply.status(404).send({ message: "User not found" });
	}

	const { password_hash, ...userWithoutPassword } = user;

	return reply.status(200).send({
		user: userWithoutPassword,
	});
}
