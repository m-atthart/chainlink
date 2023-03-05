import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	if (request.nextUrl.pathname.startsWith("/user/")) {
		const username = request.nextUrl.pathname.split("/")[2];
		return NextResponse.rewrite(
			new URL(`/user/${username}/chain`, request.url)
		);
	} else if (
		request.nextUrl.pathname === "/" ||
		request.nextUrl.pathname === "/user"
	) {
		return NextResponse.rewrite(new URL("/user/me/chain", request.url));
	}
}

export const config = {
	matcher: ["/", "/user", "/user/:username"],
};
