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

	it("should successfully register a user", async () => {
		const response = await supertest(app.server).post("/users").send({
			name: "John Doe",
			email: "john@doe.com",
			password: "123456",
		});
		expect(response.statusCode).toBe(201);
	});

	it("should return 409 if user already exists", async () => {
		const response = await supertest(app.server).post("/users").send({
			name: "John Doe",
			email: "john@doe.com",
			password: "123456",
		});

		expect(response.statusCode).toBe(409);
	});

	it("should return 400 if request body is invalid", async () => {
		const response = await supertest(app.server).post("/users").send({
			name: "John Doe",
			password: "123456",
		});

		expect(response.statusCode).toBe(400);
		console.log(response.body.message);
	});
});
