import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { GetNearbyGymsService } from "../get-nearby-gyms";

export function makeGetNearbyGymsService() {
	const gymsRepository = new PrismaGymsRepository();
	const service = new GetNearbyGymsService(gymsRepository);

	return service;
}
