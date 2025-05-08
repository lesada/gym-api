import type { UsersRepository } from "@/repositories/users-repository";
import type { User } from "@prisma/client";
import { compare } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials";

interface AuthenticateServiceRequest {
	email: string;
	password: string;
}

type AuthenticateServiceResponse = {
	user: User;
};

export class AuthenticateService {
	constructor(private readonly usersRepository: UsersRepository) {}

	async execute({
		email,
		password,
	}: AuthenticateServiceRequest): Promise<AuthenticateServiceResponse> {
		const user = await this.usersRepository.findByEmail(email);
		if (!user) throw new InvalidCredentialsError();

		const doesPasswordMatches = await compare(password, user.password_hash);
		if (!doesPasswordMatches) throw new InvalidCredentialsError();

		return {
			user,
		};
	}
}
