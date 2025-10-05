import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { ytPlaylistItemsAll } from "../../../../lib/youtube";


export async function POST(req: Request) {
	// 1. Secure the endpoint with a secret stored in .env
	const secret = req.headers.get("Authorization");
	if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
		return new Response("Unauthorized", { status: 401 });
	}

	try {
	
		const youtubeCourses = await prisma.course.findMany({
			where: {
				source: "YOUTUBE",
				youtubePlaylistId: {
					not: null,
				},
			},
		});

		if (youtubeCourses.length === 0) {
			return NextResponse.json({
				ok: true,
				message: "No YouTube courses to sync.",
			});
		}

		let totalSynced = 0;

		
		for (const course of youtubeCourses) {
			if (!course.youtubePlaylistId) continue;

			const items = await ytPlaylistItemsAll(
				course.youtubePlaylistId,
				200
			);

			const lessonUpserts = [];
			let index = 1;

			for (const it of items) {
				const vid = it.contentDetails?.videoId;
				if (!vid) continue; 

				const title = (it.snippet?.title as string) ?? `Video ${index}`;

				lessonUpserts.push(
					prisma.lesson.upsert({
						where: {
							courseId_youtubeVideoId: {
								courseId: course.id,
								youtubeVideoId: vid,
							},
						},
						update: { title, index },
						create: {
							courseId: course.id,
							title,
							index,
							youtubeVideoId: vid,
						},
					})
				);
				index++;
			}

		
			await prisma.$transaction(lessonUpserts);
			totalSynced++;
		}

		return NextResponse.json({
			ok: true,
			message: `Synced ${totalSynced} courses successfully.`,
		});
	} catch (error) {
		console.error("YouTube sync failed:", error);
		return new Response("Internal Server Error", { status: 500 });
	}
}
