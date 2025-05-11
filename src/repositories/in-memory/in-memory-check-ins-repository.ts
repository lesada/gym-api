import type { CheckInsRepository } from "@/repositories/check-ins-repository";
import type { CheckIn, Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { randomUUID } from "node:crypto";

export class InMemoryCheckInsRepository implements CheckInsRepository {
	public items: CheckIn[] = [];

	async create(data: Prisma.CheckInUncheckedCreateInput) {
		const checkIn = {
			id: randomUUID(),
			user_id: data.user_id,
			gym_id: data.gym_id,
			validated_at: data.validated_at ? new Date(data.validated_at) : null,
			created_at: new Date(),
		};

		this.items.push(checkIn);

		return checkIn;
	}

	async findByUserIdOnDate(userId: string, date: Date) {
		const startOfTheDay = dayjs(date).startOf("date");
		const endOfTheDay = dayjs(date).endOf("date");

		const checkInOnSameDate = this.items.find((checkIn) => {
			const checkInDate = dayjs(checkIn.created_at);
			const checkInDateStart = checkInDate.startOf("date");
			const checkInDateEnd = checkInDate.endOf("date");
			const isSameDate = checkInDate.isSame(startOfTheDay, "date");
			const isSameUser = checkIn.user_id === userId;

			return (
				isSameDate &&
				isSameUser &&
				checkInDate.isAfter(startOfTheDay) &&
				checkInDate.isBefore(endOfTheDay)
			);
		});

		if (!checkInOnSameDate) {
			return null;
		}

		return checkInOnSameDate;
	}
}
