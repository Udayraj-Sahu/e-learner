import { auth } from "@clerk/nextjs/server";
import { getOrCreateProfile } from "../../../../lib/getProfile";
import db from "../../../../lib/prisma";

export async function POST(req: Request) {
	const { userId } = await auth();
	if (!userId) return new Response("Unauthorized", { status: 401 });
	const { lessonId, completed } = await req.json();

	const profile = await getOrCreateProfile();
	if (!profile) return new Response("No profile", { status: 400 });

	const data = completed
		? { completed: true, completedAt: new Date() }
		: { completed: false, completedAt: null };

	await db.progress.upsert({
		where: { userId_lessonId: { userId: profile.id, lessonId } },
		update: data,
		create: { userId: profile.id, lessonId, ...data },
	});
	return Response.json({ ok: true });
}
