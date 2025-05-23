import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcryptjs";
import { beforeEach, describe, expect, test } from "vitest";
import { AuthenticateService } from "../authenticate";
import { InvalidCredentialsError } from "../errors/invalid-credentials";

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateService;

describe("Authenticate Service", () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new AuthenticateService(usersRepository);
	});

	test("should authenticate", async () => {
		await usersRepository.create({
			name: "John Doe",
			email: "johndoe@example.com",
			password_hash: await hash("123456", 6),
		});

		const { user } = await sut.execute({
			email: "johndoe@example.com",
			password: "123456",
		});

		expect(user.id).toEqual(expect.any(String));
	});

	test("wrong email", async () => {
		await expect(
			async () =>
				await sut.execute({
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

		await expect(
			async () =>
				await sut.execute({
					email: "johndoe@example.com",
					password: "123455",
				}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});
});
