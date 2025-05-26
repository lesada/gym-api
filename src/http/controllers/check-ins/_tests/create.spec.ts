import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import supertest from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("create check in controller", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should successfully create a new check in", async () => {
		const { token } = await createAndAuthenticateUser();

		const { id } = await prisma.gym.create({
			data: {
				title: "Gym A",
				latitude: -27.2092052,
				longitude: -49.6401091,
			},
		});

		const response = await supertest(app.server)
			.post(`/check-in/${id}`)
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "Gym A",
				description: "A great gym",
				phone: "1234567890",
				latitude: -27.2092052,
				longitude: -49.6401091,
			});

		expect(response.statusCode).toBe(201);
	});
});
