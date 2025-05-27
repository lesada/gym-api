import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import supertest from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("create gym controller", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should successfully create a new gym", async () => {
		const { token } = await createAndAuthenticateUser("ADMIN");
		const response = await supertest(app.server)
			.post("/gyms/create")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "Gym A",
				description: "A great gym",
				phone: "1234567890",
				latitude: -23.5505,
				longitude: -46.6333,
			});

		expect(response.statusCode).toBe(201);
	});
});
