// src/server/router/context.ts
import { router, type inferAsyncReturnType } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { prisma } from "../db/client";
import { getAuth } from "@clerk/nextjs/server";
import type {
	SignedInAuthObject,
	SignedOutAuthObject,
} from "@clerk/nextjs/dist/api";

type AuthContextProps = {
	auth: SignedInAuthObject | SignedOutAuthObject;
};

export const createContext = async (opts?: CreateNextContextOptions) => {
	const req = opts?.req;
	const res = opts?.res;

	const session = req && res && getAuth(opts.req);

	return {
		req,
		res,
		session,
		prisma,
	};
};

type Context = inferAsyncReturnType<typeof createContext>;

export const createRouter = () => router<Context>();
