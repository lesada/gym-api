import type { UsersRepository } from "@/repositories/users-repository";
import type { User } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found";

interface GetUserProfileServiceRequest {
	userId: string;
}

type GetUserProfileServiceResponse = {
	user: User;
};

export class GetUserProfileService {
	constructor(private readonly usersRepository: UsersRepository) {}

	async execute({
		userId,
	}: GetUserProfileServiceRequest): Promise<GetUserProfileServiceResponse> {
		const user = await this.usersRepository.findById(userId);

		if (!user) throw new ResourceNotFoundError();

		return {
			user,
		};
	}
}
