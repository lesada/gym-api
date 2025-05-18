import type { CheckInsRepository } from "@/repositories/check-ins-repository";
import { ResourceNotFoundError } from "@/services/errors/resource-not-found";
import type { CheckIn } from "@prisma/client";

interface ValidateCheckInServiceRequest {
	checkInId: string;
}

interface ValidateCheckInServiceResponse {
	checkIn: CheckIn;
}

export class ValidateCheckInService {
	constructor(private readonly checkInsRepository: CheckInsRepository) {}

	async execute({
		checkInId,
	}: ValidateCheckInServiceRequest): Promise<ValidateCheckInServiceResponse> {
		const checkIn = await this.checkInsRepository.findById(checkInId);

		if (!checkIn) {
			throw new ResourceNotFoundError();
		}

		checkIn.validated_at = new Date();

		await this.checkInsRepository.save(checkIn);

		return {
			checkIn,
		};
	}
}
