import type { UsersRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";
import { z } from "zod";
import { UserAlreadyExistsError } from "./errors/user-already-exists";

export const RegisterServiceRequestSchema = z.object({
	name: z.string(),
	email: z.string().email(),
	password: z.string(),
});

type RegisterServiceRequest = z.infer<typeof RegisterServiceRequestSchema>;

export class RegisterService {
	constructor(private readonly usersRepository: UsersRepository) {}

	async execute({ email, name, password }: RegisterServiceRequest) {
		const password_hash = await hash(password, 6);

		const userWithSameEmail = await this.usersRepository.findByEmail(email);

		if (userWithSameEmail) throw new UserAlreadyExistsError();

		const user = await this.usersRepository.create({
			email,
			name,
			password_hash,
		});

		return { user };
	}
}
