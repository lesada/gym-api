import type { GymsRepository } from "@/repositories/gyms-repository";
import type { Gym } from "@prisma/client";

interface SearchGymsServiceRequest {
	query: string;
	page: number;
}

interface SearchGymsServiceResponse {
	gyms: Gym[];
}

export class SearchGymsService {
	constructor(private readonly gymsRepository: GymsRepository) {}

	async execute({
		query,
		page,
	}: SearchGymsServiceRequest): Promise<SearchGymsServiceResponse> {
		const gyms = await this.gymsRepository.searchMany(query, page);

		return {
			gyms,
		};
	}
}
