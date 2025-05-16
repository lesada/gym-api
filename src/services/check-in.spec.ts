import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { CheckInService } from "@/services/check-in";
import { Decimal } from "@prisma/client/runtime/library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInService;

describe("Check-in Use Case", () => {
	beforeEach(() => {
		checkInsRepository = new InMemoryCheckInsRepository();
		gymsRepository = new InMemoryGymsRepository();

		gymsRepository.items.push({
			id: "gym-01",
			title: "Gym 01",
			description: "",
			latitude: Decimal(34.0194),
			longitude: Decimal(-118.411),
			phone: "",
		});

		sut = new CheckInService(checkInsRepository, gymsRepository);
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should be able to check in", async () => {
		const { checkIn } = await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: 34.0194,
			userLongitude: -118.411,
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	it("should not be able to check in on distant gym", async () => {
		gymsRepository.items.push({
			id: "gym-02",
			title: "Gym 02",
			description: "",
			latitude: Decimal(37.7272),
			longitude: Decimal(-123.032),
			phone: "",
		});

		await expect(() =>
			sut.execute({
				gymId: "gym-02",
				userId: "user-01",
				userLatitude: 34.0194,
				userLongitude: -118.411,
			}),
		).rejects.toBeInstanceOf(Error);
	});

	it("should not be able to check in twice in the same day", async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

		await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: 34.0194,
			userLongitude: -118.411,
		});

		await expect(() =>
			sut.execute({
				gymId: "gym-01",
				userId: "user-01",
				userLatitude: 34.0194,
				userLongitude: -118.411,
			}),
		).rejects.toBeInstanceOf(Error);
	});

	it("should be able to check in twice but in different days", async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

		await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: 34.0194,
			userLongitude: -118.411,
		});

		vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

		const { checkIn } = await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: 34.0194,
			userLongitude: -118.411,
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});
});
