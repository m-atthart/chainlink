// @ts-check
import { z } from "zod";

const serverSchema = z.object({
	DATABASE_URL: z.string().url(),
	NODE_ENV: z.enum(["development", "test", "production"]),
	CLERK_SECRET_KEY: z.string(),
});

const clientSchema = z.object({
	NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
});

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {Record<keyof z.infer<typeof serverSchema> | keyof z.infer<typeof clientSchema>, string | undefined>}
 */
const processEnv = {
	NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
		process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
	DATABASE_URL: process.env.DATABASE_URL,
	NODE_ENV: process.env.NODE_ENV,
	CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
};

const mergedSchema = serverSchema.merge(clientSchema);

/** @typedef {z.input<typeof mergedSchema>} MergedInput */
/** @typedef {z.infer<typeof mergedSchema>} MergedOutput */
/** @typedef {z.SafeParseReturnType<MergedInput, MergedOutput>} MergedSafeParseReturn */

let env = /** @type {MergedOutput} */ (process.env);

if (!!process.env.SKIP_ENV_VALIDATION == false) {
	const isServer = typeof window === "undefined";

	const parsed = /** @type {MergedSafeParseReturn} */ (
		isServer
			? mergedSchema.safeParse(processEnv) // on server we can validate all env vars
			: clientSchema.safeParse(processEnv) // on client we can only validate the ones that are exposed
	);

	if (parsed.success === false) {
		console.error(
			"❌ Invalid environment variables:",
			parsed.error.flatten().fieldErrors
		);
		throw new Error("Invalid environment variables");
	}

	env = new Proxy(parsed.data, {
		get(target, prop) {
			if (typeof prop !== "string") return undefined;
			// Throw a descriptive error if a server-side env var is accessed on the client
			// Otherwise it would just be returning `undefined` and be annoying to debug
			if (!isServer && !prop.startsWith("NEXT_PUBLIC_"))
				throw new Error(
					process.env.NODE_ENV === "production"
						? "❌ Attempted to access a server-side environment variable on the client"
						: `❌ Attempted to access server-side environment variable '${prop}' on the client`
				);
			return target[/** @type {keyof typeof target} */ (prop)];
		},
	});
}

export { env };
