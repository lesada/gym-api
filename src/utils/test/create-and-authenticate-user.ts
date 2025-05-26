import { app } from "@/app";
import supertest from "supertest";

export async function createAndAuthenticateUser() {
	await supertest(app.server).post("/users").send({
		name: "John Doe",
		email: "john@doe.com",
		password: "123456",
	});

	const authResponse = await supertest(app.server).post("/auth").send({
		email: "john@doe.com",
		password: "123456",
	});

	const { token } = authResponse.body;

	return {
		token,
	};
}
