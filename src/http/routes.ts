import type { FastifyInstance } from "fastify";
import { gymsRoutes } from "./controllers/gyms/routes";
import { usersRoutes } from "./controllers/users/routes";

export async function appRoutes(app: FastifyInstance) {
	app.register(usersRoutes);
	app.register(gymsRoutes, {
		prefix: "/gyms",
	});
}
