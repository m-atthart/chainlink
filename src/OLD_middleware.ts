/*
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
	beforeAuth: (request: NextRequest) => {
		if (request.nextUrl.pathname === "/") {
			return NextResponse.redirect(new URL("/login", request.url));
		}
	},
	publicRoutes: ["/(.*)"],
});

export const config = {
	matcher: ["/", "/((?!.*\\..*|_next).*)", "/(api|trpc)(.*)"],
};
*/
