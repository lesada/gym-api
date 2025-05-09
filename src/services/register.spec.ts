import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { compare } from "bcryptjs";
import { beforeEach, describe, expect, test } from "vitest";
import { UserAlreadyExistsError } from "./errors/user-already-exists";
import { RegisterService } from "./register";

let usersRepository: InMemoryUsersRepository;
let registerService: RegisterService;

describe("Register Service", () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		registerService = new RegisterService(usersRepository);
	});

	test("should register", async () => {
		const { user } = await registerService.execute({
			name: "John Doe",
			email: "johndoe@example.com",
			password: "123456",
		});

		expect(user.id).toEqual(expect.any(String));
	});

	test("should hash user password upon registration", async () => {
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
		const email = "johndoe@example.com";

		await registerService.execute({
			name: "John Doe",
			email,
			password: "123456",
		});

		await expect(() =>
			registerService.execute({
				name: "John Doe",
				email,
				password: "123456",
			}),
		).rejects.toBeInstanceOf(UserAlreadyExistsError);
	});
});
