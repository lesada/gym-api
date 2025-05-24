import { authenticate } from "@/http/controllers/authenticate";
import { InvalidCredentialsError } from "@/services/errors/invalid-credentials";
import { makeAuthenticateService } from "@/services/factories/make-authenticate-service";
import type { FastifyReply, FastifyRequest } from "fastify";
import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";

vi.mock("@/services/factories/make-authenticate-service", () => ({
	makeAuthenticateService: vi.fn(),
}));

describe("authenticate controller", () => {
	const mockRequest = {
		body: { email: "user@example.com", password: "validpassword" },
	} as unknown as FastifyRequest;
	const mockReply = {
		status: vi.fn().mockReturnThis(),
		send: vi.fn(),
	} as unknown as FastifyReply;

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return 200 if credentials are valid", async () => {
		const mockAuthenticateService = {
			execute: vi.fn().mockResolvedValue(true),
		};

		(makeAuthenticateService as Mock).mockReturnValue(mockAuthenticateService);

		await authenticate(mockRequest, mockReply);

		expect(mockReply.status).toHaveBeenCalledWith(200);
		expect(mockReply.send).toHaveBeenCalled();
	});

	it("should return 400 if credentials are invalid", async () => {
		const mockAuthenticateService = {
			execute: vi.fn().mockRejectedValue(new InvalidCredentialsError()),
		};

		(makeAuthenticateService as Mock).mockReturnValue(mockAuthenticateService);

		await authenticate(mockRequest, mockReply);

		expect(mockReply.status).toHaveBeenCalledWith(400);
		expect(mockReply.send).toHaveBeenCalled();
	});

	it("should return 400 if request body is invalid", async () => {
		mockRequest.body = { email: "invalid-email", password: "123" };

		await authenticate(mockRequest, mockReply);

		expect(mockReply.status).toHaveBeenCalledWith(400);
		expect(mockReply.send).toHaveBeenCalled();
	});

	it("should return 400 if ZodError is thrown", async () => {
		const mockAuthenticateService = {
			execute: vi.fn().mockRejectedValue(new ZodError([])),
		};

		(makeAuthenticateService as Mock).mockReturnValue(mockAuthenticateService);

		await authenticate(mockRequest, mockReply);

		expect(mockReply.status).toHaveBeenCalledWith(400);
		expect(mockReply.send).toHaveBeenCalledWith(
			expect.objectContaining({
				type: "validation",
			}),
		);
	});
});
