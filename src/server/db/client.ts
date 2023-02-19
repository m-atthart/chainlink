// src/server/db/client.ts
import { PrismaClient } from "@prisma/client";
import { env } from "../../env/server.mjs";

declare global {
	var prisma: PrismaClient | undefined;
}

export const prisma =
	global.prisma ||
	new PrismaClient({
		log: ["query"],
	});

if (env.ENV_TYPE !== "production") {
	global.prisma = prisma;
}
