import type { CheckInsRepository } from "@/repositories/check-ins-repository";
import type { GymsRepository } from "@/repositories/gyms-repository";
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
	}: CheckInServiceRequest): Promise<CheckInServiceResponse> {
		const gym = await this.gymsRepository.findById(gymId);

		if (!gym) {
			throw new ResourceNotFoundError();
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
