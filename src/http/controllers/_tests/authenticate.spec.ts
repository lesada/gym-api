import { app } from "@/app";
import supertest from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("register controller", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should successfully auth a user", async () => {
		await supertest(app.server).post("/users").send({
			name: "John Doe",
			email: "john@doe.com",
			password: "123456",
		});

		const response = await supertest(app.server).post("/auth").send({
			email: "john@doe.com",
			password: "123456",
		});
		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({
			token: expect.any(String),
		});
	});
});
