import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcryptjs";
import { beforeEach, describe, expect, test } from "vitest";
import { AuthenticateService } from "./authenticate";
import { InvalidCredentialsError } from "./errors/invalid-credentials";

let usersRepository: InMemoryUsersRepository;
let authenticateService: AuthenticateService;

describe("Authenticate Service", () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		authenticateService = new AuthenticateService(usersRepository);
	});

	test("should authenticate", async () => {
		await usersRepository.create({
			name: "John Doe",
			email: "johndoe@example.com",
			password_hash: await hash("123456", 6),
		});

		const { user } = await authenticateService.execute({
			email: "johndoe@example.com",
			password: "123456",
		});

		expect(user.id).toEqual(expect.any(String));
	});

	test("wrong email", async () => {
		expect(
			async () =>
				await authenticateService.execute({
					email: "johndoe@example.com",
					password: "123456",
				}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});

	test("wrong password", async () => {
		await usersRepository.create({
			name: "John Doe",
			email: "johndoe@example.com",
			password_hash: await hash("123456", 6),
		});

		expect(
			async () =>
				await authenticateService.execute({
					email: "johndoe@example.com",
					password: "123455",
				}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});
});
