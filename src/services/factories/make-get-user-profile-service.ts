import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { GetUserProfileService } from "../get-user-profile";

export function makeGetUserProfileService() {
	const usersRepository = new PrismaUsersRepository();
	const service = new GetUserProfileService(usersRepository);

	return service;
}
