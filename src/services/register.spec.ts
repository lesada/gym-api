import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { compare } from "bcryptjs";
import { describe, expect, test } from "vitest";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
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

	test("should not be able to register with same email twice", async () => {
		const usersRepository = new InMemoryUsersRepository();
		const registerUseCase = new RegisterService(usersRepository);

		const email = "johndoe@example.com";

		await registerUseCase.execute({
			name: "John Doe",
			email,
			password: "123456",
		});

		expect(() =>
			registerUseCase.execute({
				name: "John Doe",
				email,
				password: "123456",
			}),
		).rejects.toBeInstanceOf(UserAlreadyExistsError);
	});
});
