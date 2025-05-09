import { InvalidCredentialsError } from "@/services/errors/invalid-credentials";
import { makeAuthenticateService } from "@/services/factories/make-authenticate-service";
import type { FastifyReply, FastifyRequest } from "fastify";
import { type Mock, describe, expect, it, vi } from "vitest";
import { authenticate } from "./authenticate";

vi.mock("@/services/factories/make-authenticate-service");

describe("authenticate controller", () => {
	it("should return 200 on successful authentication", async () => {
		const mockAuthenticateService = {
			execute: vi.fn().mockResolvedValueOnce(undefined),
		};
		(makeAuthenticateService as Mock).mockReturnValue(mockAuthenticateService);

		const request = {
			body: {
				email: "test@example.com",
				password: "password123",
			},
		} as FastifyRequest;

		const reply = {
			status: vi.fn().mockReturnThis(),
			send: vi.fn(),
		} as unknown as FastifyReply;

		await authenticate(request, reply);

		expect(mockAuthenticateService.execute).toHaveBeenCalledWith({
			email: "test@example.com",
			password: "password123",
		});
		expect(reply.status).toHaveBeenCalledWith(200);
		expect(reply.send).toHaveBeenCalled();
	});

	it("should return 400 on invalid credentials", async () => {
		const mockAuthenticateService = {
			execute: vi.fn().mockRejectedValueOnce(new InvalidCredentialsError()),
		};
		(makeAuthenticateService as Mock).mockReturnValue(mockAuthenticateService);

		const request = {
			body: {
				email: "test@example.com",
				password: "wrongpassword",
			},
		} as FastifyRequest;

		const reply = {
			status: vi.fn().mockReturnThis(),
			send: vi.fn(),
		} as unknown as FastifyReply;

		await authenticate(request, reply);

		expect(mockAuthenticateService.execute).toHaveBeenCalledWith({
			email: "test@example.com",
			password: "wrongpassword",
		});
		expect(reply.status).toHaveBeenCalledWith(400);
		expect(reply.send).toHaveBeenCalled();
	});

	it("should throw an error for unexpected exceptions", async () => {
		const mockAuthenticateService = {
			execute: vi.fn().mockRejectedValueOnce(new Error("Unexpected error")),
		};
		(makeAuthenticateService as Mock).mockReturnValue(mockAuthenticateService);

		const request = {
			body: {
				email: "test@example.com",
				password: "password123",
			},
		} as FastifyRequest;

		const reply = {
			status: vi.fn(),
			send: vi.fn(),
		} as unknown as FastifyReply;

		await expect(authenticate(request, reply)).rejects.toThrow(
			"Unexpected error",
		);
		expect(mockAuthenticateService.execute).toHaveBeenCalledWith({
			email: "test@example.com",
			password: "password123",
		});
	});
});
