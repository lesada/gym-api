import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateGymService } from "./create-gym";

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymService;

describe("Create Gym Service", () => {
	beforeEach(() => {
		gymsRepository = new InMemoryGymsRepository();
		sut = new CreateGymService(gymsRepository);
	});

	it("should to create gym", async () => {
		const { gym } = await sut.execute({
			title: "Gym",
			description: null,
			phone: null,
			latitude: -27.2092052,
			longitude: -49.6401091,
		});

		expect(gym.id).toEqual(expect.any(String));
	});
});
