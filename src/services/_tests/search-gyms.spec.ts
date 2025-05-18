import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { SearchGymsService } from "../search-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsService;

describe("Search Gyms Service", () => {
	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository();
		sut = new SearchGymsService(gymsRepository);
	});

	it("should be able to search for gyms", async () => {
		await gymsRepository.create({
			title: "Delta Gym",
			description: null,
			phone: null,
			latitude: -27.2092052,
			longitude: -49.6401091,
		});

		await gymsRepository.create({
			title: "Omega Gym",
			description: null,
			phone: null,
			latitude: -27.2092052,
			longitude: -49.6401091,
		});

		const { gyms } = await sut.execute({
			query: "Delta",
			page: 1,
		});

		expect(gyms).toHaveLength(1);
		expect(gyms).toEqual([expect.objectContaining({ title: "Delta Gym" })]);
	});

	it("should be able to fetch paginated gym search", async () => {
		for (let i = 1; i <= 22; i++) {
			await gymsRepository.create({
				title: `Delta Gym ${i}`,
				description: null,
				phone: null,
				latitude: -27.2092052,
				longitude: -49.6401091,
			});
		}

		const { gyms } = await sut.execute({
			query: "Delta",
			page: 2,
		});

		expect(gyms).toHaveLength(2);
		expect(gyms).toEqual([
			expect.objectContaining({ title: "Delta Gym 21" }),
			expect.objectContaining({ title: "Delta Gym 22" }),
		]);
	});
});
