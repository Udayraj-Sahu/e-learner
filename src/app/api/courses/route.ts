import { auth } from "@clerk/nextjs/server";
import db from "../../../../lib/prisma";

export async function POST(req: Request) {
	const { userId, _sessionClaims } = await auth();
	if (!userId) return new Response("Unauthorized", { status: 401 });

	const { title, slug, description, thumbnail } = await req.json();
	const course = await db.course.create({
		data: { title, slug, description, thumbnail },
	});
	return Response.json(course);
}
