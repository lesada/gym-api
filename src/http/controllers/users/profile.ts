import { makeGetUserProfileService } from "@/services/factories/make-get-user-profile-service";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export const profileResponseSchema = z.object({
	user: z.object({
		id: z.string().uuid(),
		name: z.string(),
		email: z.string(),
		created_at: z.coerce.date(),
	}),
});

export async function profile(request: FastifyRequest, reply: FastifyReply) {
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
