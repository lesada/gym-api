import type { GymsRepository } from "@/repositories/gyms-repository";
import type { Gym } from "@prisma/client";

interface GetNearbyGymsServiceRequest {
	userLatitude: number;
	userLongitude: number;
}

interface GetNearbyGymsServiceResponse {
	gyms: Gym[];
}

export class GetNearbyGymsService {
	constructor(private readonly gymsRepository: GymsRepository) {}

	async execute({
		userLatitude,
		userLongitude,
	}: GetNearbyGymsServiceRequest): Promise<GetNearbyGymsServiceResponse> {
		const gyms = await this.gymsRepository.findManyNearby({
			latitude: userLatitude,
			longitude: userLongitude,
		});

		return {
			gyms,
		};
	}
}
