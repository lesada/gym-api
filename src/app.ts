import fastifyJwt from "@fastify/jwt";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastify from "fastify";
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import { ZodError } from "zod";
import { env } from "./env";
import { appRoutes } from "./http/routes";

export const app = fastify();

app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: "Gym API",
			version: "1.0.0",
		},
	},
	transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
	routePrefix: "/docs",
});

app.register(appRoutes);

app.setErrorHandler((error, _, reply) => {
	if (error instanceof ZodError) {
		return reply
			.status(400)
			.send({ message: "Validation error.", issues: error.format() });
	}

	if (error.validation && error.code === "FST_ERR_VALIDATION") {
		return reply
			.status(400)
			.send({ message: "Validation error.", issues: error.validation });
	}

	if (env.NODE_ENV !== "production") {
		console.error(error);
	} else {
		// TODO: log to external service
	}

	return reply.status(500).send({ message: "Internal server error." });
});
