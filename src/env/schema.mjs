// @ts-check
import { z } from "zod";

export const serverSchema = z.object({
	DATABASE_URL: z.string().url(),
	ENV_TYPE: z.enum(["local", "development", "production"]),
	NEXTAUTH_SECRET: z.string(),
	NEXTAUTH_URL: z.string().url(),
	TWITCH_CLIENT_ID: z.string(),
	TWITCH_CLIENT_SECRET: z.string(),
	CLERK_SECRET_KEY: z.string(),
});

export const clientSchema = z.object({
	NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
});

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[k] | undefined }}
 */
export const clientEnv = {
	NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
		process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
};
