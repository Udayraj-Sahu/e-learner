// middleware.ts (root or src/middleware.ts)
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublic = createRouteMatcher([
	"/",
	"/sign-in(.*)",
	"/sign-up(.*)",
	"/course/:slug", // keep overview public; lessons are gated
]);

export default clerkMiddleware(async (auth, req) => {
	if (isPublic(req)) return;

	const { isAuthenticated } = await auth();
	if (!isAuthenticated) {
		// redirect to /sign-in?redirectUrl=<original>
		const url = new URL("/sign-in", req.url);
		url.searchParams.set("redirectUrl", req.url);
		return NextResponse.redirect(url);
	}
});

export const config = {
	matcher: [
		// run on app routes and APIs, skip static files and Next internals
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		"/(api|trpc)(.*)",
	],
};
