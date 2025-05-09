import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { vi } from "vitest";

// Mock the PrismaUsersRepository to use the InMemoryUsersRepository
vi.mock("@/repositories/prisma/prisma-users-repository", () => {
	return {
		PrismaUsersRepository: InMemoryUsersRepository,
	};
});

// Mock the makeRegisterService to use the InMemoryUsersRepository
vi.mock("@/services/factories/make-register-service", () => {
	return {
		makeRegisterService: () => {
			const usersRepository = new InMemoryUsersRepository();
			return new (require("@/services/register").RegisterService)(
				usersRepository,
			);
		},
	};
});
