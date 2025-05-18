import type { CheckInsRepository } from "@/repositories/check-ins-repository";
import type { CheckIn } from "@prisma/client";

interface GetUserCheckInsHistoryServiceRequest {
	userId: string;
	page: number;
}

interface GetUserCheckInsHistoryServiceResponse {
	checkIns: CheckIn[];
}

export class GetUserCheckInsHistoryService {
	constructor(private readonly checkInsRepository: CheckInsRepository) {}

	async execute({
		userId,
		page,
	}: GetUserCheckInsHistoryServiceRequest): Promise<GetUserCheckInsHistoryServiceResponse> {
		const checkIns = await this.checkInsRepository.findManyByUserId(
			userId,
			page,
		);

		return {
			checkIns,
		};
	}
}
