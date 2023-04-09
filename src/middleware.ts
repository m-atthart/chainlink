import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { withClerkMiddleware } from "@clerk/nextjs/server";

export default withClerkMiddleware((request: NextRequest) => {
	if (request.nextUrl.pathname === "/") {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	return NextResponse.next();
});

export const config = {
	matcher: ["/", "/((?!_next/image|_next/static|favicon.ico).*)"],
};
