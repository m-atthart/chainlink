import { drizzle as drizzlify } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
import { env } from "../../env.mjs";

const globalForDrizzle = globalThis as unknown as {
	drizzle: ReturnType<typeof drizzlify> | undefined;
};

export const drizzle =
	globalForDrizzle.drizzle ??
	drizzlify(
		connect({
			host: env.DATABASE_HOST,
			username: env.DATABASE_USERNAME,
			password: env.DATABASE_PASSWORD,
		}),
		{ logger: env.NODE_ENV === "development" }
	);

if (env.NODE_ENV !== "production") globalForDrizzle.drizzle = drizzle;
