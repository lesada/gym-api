import type { CheckInsRepository } from "@/repositories/check-ins-repository";
import type { GymsRepository } from "@/repositories/gyms-repository";
import { getDistanceBetweenCordinates } from "@/utils/getDistanceBetweenCordinates";
import type { CheckIn } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found";

interface CheckInServiceRequest {
	userId: string;
	gymId: string;
	userLatitude: number;
	userLongitude: number;
}

type CheckInServiceResponse = {
	checkIn: CheckIn;
};

export class CheckInService {
	constructor(
		private readonly checkInsRepository: CheckInsRepository,
		private readonly gymsRepository: GymsRepository,
	) {}

	async execute({
		userId,
		gymId,
		userLatitude,
		userLongitude,
	}: CheckInServiceRequest): Promise<CheckInServiceResponse> {
		const gym = await this.gymsRepository.findById(gymId);

		if (!gym) {
			throw new ResourceNotFoundError();
		}

		const distance = getDistanceBetweenCordinates(
			{
				latitude: userLatitude,
				longitude: userLongitude,
			},
			{
				latitude: gym.latitude.toNumber(),
				longitude: gym.longitude.toNumber(),
			},
		);

		const MAX_DISTANCE_IN_KM = 0.1; // 100 meters

		if (distance > MAX_DISTANCE_IN_KM) {
			throw new Error();
		}

		const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
			userId,
			new Date(),
		);

		if (checkInOnSameDay) {
			throw new Error();
		}

		const checkIn = await this.checkInsRepository.create({
			gym_id: gymId,
			user_id: userId,
		});

		return {
			checkIn,
		};
	}
}
