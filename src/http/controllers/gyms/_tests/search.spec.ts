import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import supertest from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("search gyms controller", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should successfully get nearby gyms", async () => {
		const { token } = await createAndAuthenticateUser();
		await supertest(app.server)
			.post("/gyms/create")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "Gym A",
				description: "A great gym",
				phone: "1234567890",
				latitude: -23.5505,
				longitude: -46.6333,
			});

		await supertest(app.server)
			.post("/gyms/create")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "Gym B",
				description: "Some description.",
				phone: "1234567890",
				latitude: -27.0610928,
				longitude: -49.5229501,
			});

		const response = await supertest(app.server)
			.get("/gyms/search")
			.query({
				query: "Gym B",
				page: 1,
			})
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(response.statusCode).toEqual(200);
		expect(response.body.gyms).toHaveLength(1);
		expect(response.body.gyms).toEqual([
			expect.objectContaining({
				title: "Gym B",
			}),
		]);
	});
});
