import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { prisma } from "../db/client";
import { getAuth, clerkClient } from "@clerk/nextjs/server";
import type {
	SignedInAuthObject,
	SignedOutAuthObject,
} from "@clerk/nextjs/dist/api";

type CreateContextOptions = {
	session: SignedInAuthObject | SignedOutAuthObject | undefined;
};

const createInnerTRPCContext = (opts: CreateContextOptions) => {
	return {
		session: opts.session,
		prisma,
	};
};

export const createContext = async (opts?: CreateNextContextOptions) => {
	const req = opts?.req;
	const res = opts?.res;

	const session = req && res && getAuth(req);
	if (session && session.userId && !session.user) {
		const user = await clerkClient.users.getUser(session.userId);
		session.user = user;
	}

	const innerTRPCContext = createInnerTRPCContext({
		session,
	});

	return {
		...innerTRPCContext,
		req,
		res,
	};
};

export type Context = typeof createContext;
