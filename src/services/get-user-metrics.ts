import type { CheckInsRepository } from "@/repositories/check-ins-repository";

interface GetUserMetricsServiceRequest {
	userId: string;
}

interface GetUserMetricsServiceResponse {
	checkInsCount: number;
}

export class GetUserMetricsService {
	constructor(private readonly checkInsRepository: CheckInsRepository) {}

	async execute({
		userId,
	}: GetUserMetricsServiceRequest): Promise<GetUserMetricsServiceResponse> {
		const checkInsCount = await this.checkInsRepository.countByUserId(userId);

		return {
			checkInsCount,
		};
	}
}
