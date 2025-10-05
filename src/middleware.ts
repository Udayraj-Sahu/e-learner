
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublic = createRouteMatcher([
	"/",
	"/sign-in(.*)",
	"/sign-up(.*)",
	"/course/:slug", 
]);

export default clerkMiddleware(async (auth, req) => {
	if (isPublic(req)) return;

	const { isAuthenticated } = await auth();
	if (!isAuthenticated) {
	
		const url = new URL("/sign-in", req.url);
		url.searchParams.set("redirectUrl", req.url);
		return NextResponse.redirect(url);
	}
});

export const config = {
	matcher: [
		
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		"/(api|trpc)(.*)",
	],
};
