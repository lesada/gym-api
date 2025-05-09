import { register } from "@/http/controllers/register";
import { UserAlreadyExistsError } from "@/services/errors/user-already-exists";
import { makeRegisterService } from "@/services/factories/make-register-service";
import type { FastifyReply, FastifyRequest } from "fastify";
import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";

// Mock the necessary dependencies
vi.mock("@/services/factories/make-register-service");
vi.mock("@/repositories/prisma/prisma-users-repository");

describe("register controller", () => {
	let mockRequest: FastifyRequest;
	let mockReply: FastifyReply;
	let registerService: { execute: vi.Mock };

	beforeEach(() => {
		// Mock the request and reply
		mockRequest = {
			body: {
				name: "John",
				email: "john@example.com",
				password: "password123",
			},
		} as FastifyRequest;
		mockReply = {
			status: vi.fn().mockReturnThis(),
			send: vi.fn(),
		} as unknown as FastifyReply;

		registerService = { execute: vi.fn() };

		(vi.mocked(makeRegisterService) as Mock).mockReturnValue(registerService);

		vi.clearAllMocks();
	});

	it("should successfully register a user", async () => {
		registerService.execute.mockResolvedValueOnce({
			user: { email: "john@example.com", name: "John" },
		});

		await register(mockRequest, mockReply);

		expect(registerService.execute).toHaveBeenCalledWith({
			name: "John",
			email: "john@example.com",
			password: "password123",
		});
		expect(mockReply.status).toHaveBeenCalledWith(201);
		expect(mockReply.send).toHaveBeenCalled();
	});

	it("should return 409 if user already exists", async () => {
		registerService.execute.mockRejectedValueOnce(new UserAlreadyExistsError());

		await register(mockRequest, mockReply);

		expect(mockReply.status).toHaveBeenCalledWith(409);
		expect(mockReply.send).toHaveBeenCalledWith({
			message: "User already exists",
		});
	});

	it("should return 400 if request body is invalid", async () => {
		mockRequest.body = { name: "", email: "invalid-email", password: "123" };

		await register(mockRequest, mockReply);

		expect(mockReply.status).toHaveBeenCalledWith(400);
		expect(mockReply.send).toHaveBeenCalled();
	});
});
