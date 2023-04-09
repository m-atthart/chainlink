import { createNextApiHandler } from "@trpc/server/adapters/next";
import { appRouter } from "../../../server/trpc";
import { createContext } from "../../../server/trpc/context";
import { env } from "../../../env.mjs";

export default createNextApiHandler({
	router: appRouter,
	createContext: createContext,
	onError:
		env.NODE_ENV === "development"
			? ({ path, error }) => {
					console.error(
						`❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
					);
			  }
			: undefined,
});
