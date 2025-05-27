import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import supertest from "supertest";

export async function createAndAuthenticateUser(
	role: "ADMIN" | "USER" = "USER",
) {
	await prisma.user.create({
		data: {
			name: "John Doe",
			email: "john@doe.com",
			password_hash: await hash("123456", 6),
			role,
		},
	});

	const authResponse = await supertest(app.server).post("/auth").send({
		email: "john@doe.com",
		password: "123456", //NOSONAR,
		role,
	});

	const { token } = authResponse.body;

	return {
		token,
	};
}
