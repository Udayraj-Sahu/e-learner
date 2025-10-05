import { auth } from "@clerk/nextjs/server";
import db from "../../../../lib/prisma";

export async function POST(req: Request) {
	const { userId } = await auth();
	if (!userId) return new Response("Unauthorized", { status: 401 });
	const { courseId, title, index, videoUrl, content } = await req.json();
	const lesson = await db.lesson.create({
		data: { courseId, title, index, videoUrl, content },
	});
	return Response.json(lesson);
}
