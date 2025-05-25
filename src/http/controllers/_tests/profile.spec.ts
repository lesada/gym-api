import { app } from "@/app";
import supertest from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("profile controller", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should successfully get the user profile", async () => {
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
		const response = await supertest(app.server)
			.get("/me")
			.set("Authorization", `Bearer ${token}`);

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({
			user: {
				id: expect.any(String),
				name: "John Doe",
				email: "john@doe.com",
				created_at: expect.any(String),
			},
		});
	});
});
