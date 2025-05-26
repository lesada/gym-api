import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { GetUserCheckInsHistoryService } from "../get-user-check-ins-history";

export function makeGetUserCheckInsHistoryService() {
	const checkInsRepository = new PrismaCheckInsRepository();
	const service = new GetUserCheckInsHistoryService(checkInsRepository);

	return service;
}
