import { compare } from "bcryptjs";
import { describe, expect, test } from "vitest";
import { RegisterService } from "./register";

describe("Register Service", () => {
	test("should hash user password upon registration", async () => {
		const registerService = new RegisterService({
			async findByEmail(email) {
				return null;
			},

			async create(data) {
				return {
					id: "user-1",
					name: data.name,
					email: data.email,
					password_hash: data.password_hash,
					created_at: new Date(),
				};
			},
		});

		const { user } = await registerService.execute({
			name: "John Doe",
			email: "john.doe@gmail.com",
			password: "123456",
		});

		const isPasswordCorrectlyHashed = await compare(
			"123456",
			user.password_hash,
		);

		expect(isPasswordCorrectlyHashed).toBeTruthy();
	});
});
