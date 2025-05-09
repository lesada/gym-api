import { UserAlreadyExistsError } from "@/services/errors/user-already-exists";
import { makeRegisterService } from "@/services/factories/make-register-service";
import type { FastifyReply, FastifyRequest } from "fastify";
import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";
import { register } from "./register";

vi.mock("@/services/factories/make-register-service");

describe("register handler", () => {
	function createMockReply(): FastifyReply {
		const send = vi.fn();
		const status = vi
			.fn()
			.mockReturnValue({ send }) as unknown as FastifyReply["status"];
		return { status } as unknown as FastifyReply;
	}

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should register a user successfully", async () => {
		const execute = vi.fn().mockResolvedValue(undefined);
		(makeRegisterService as unknown as Mock).mockReturnValue({ execute });

		const req = {
			body: {
				name: "Lauren",
				email: "lauren@example.com",
				password: "123456",
			},
		} as FastifyRequest;

		const rep = createMockReply();

		await register(req, rep);

		expect(execute).toHaveBeenCalledWith({
			name: "Lauren",
			email: "lauren@example.com",
			password: "123456",
		});
		expect(rep.status).toHaveBeenCalledWith(201);
		expect(
			(rep.status as Mock).mock.results[0].value.send,
		).toHaveBeenCalledWith();
	});

	it("should return 409 if the user already exists", async () => {
		const execute = vi.fn().mockRejectedValue(new UserAlreadyExistsError());
		(makeRegisterService as unknown as Mock).mockReturnValue({ execute });

		const req = {
			body: {
				name: "Lauren",
				email: "lauren@example.com",
				password: "123456",
			},
		} as FastifyRequest;

		const rep = createMockReply();

		await register(req, rep);

		expect(rep.status).toHaveBeenCalledWith(409);
		expect(
			(rep.status as Mock).mock.results[0].value.send,
		).toHaveBeenCalledWith({
			message: "User already exists",
		});
	});
});
