import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { compare } from "bcryptjs";
import { describe, expect, test } from "vitest";
import { RegisterService } from "./register";

describe("Register Service", () => {
	test("should hash user password upon registration", async () => {
		const usersRepository = new InMemoryUsersRepository();

		const registerService = new RegisterService(usersRepository);

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
