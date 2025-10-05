import { auth } from "@clerk/nextjs/server";
import { getOrCreateProfile } from "../../../../lib/getProfile";
import db from "../../../../lib/prisma";

export async function POST(req: Request) {
	const { userId } = await auth();
	if (!userId) return new Response("Unauthorized", { status: 401 });
	const { courseId } = await req.json();

	const profile = await getOrCreateProfile();
	if (!profile) return new Response("No profile", { status: 400 });

	await db.enrollment.upsert({
		where: { userId_courseId: { userId: profile.id, courseId } },
		update: {},
		create: { userId: profile.id, courseId },
	});
	return Response.json({ ok: true });
}
