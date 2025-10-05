import { auth } from "@clerk/nextjs/server";
import { prisma } from "../../../lib/prisma";
import SubmitButton from "@/components/SubmitButton";
import {
	parsePlaylistId,
	toSlug,
	ytPlaylistInfo,
	ytPlaylistItemsAll,
} from "../../../lib/youtube";

export default async function Creator() {
	const { userId } = await auth();
	if (!userId) return <div className="p-6">Sign in</div>;
	async function createCourseAction(fd: FormData) {
		"use server";
		const title = String(fd.get("title"));
		const slug = String(fd.get("slug") || toSlug(title));
		const description = String(fd.get("description") || "");
		const thumbnail = String(fd.get("thumbnail") || "");
		await prisma.course.create({
			data: { title, slug, description, thumbnail, source: "ADMIN" },
		});
	}

	async function createLessonAction(fd: FormData) {
		"use server";
		await prisma.lesson.create({
			data: {
				courseId: String(fd.get("courseId")),
				title: String(fd.get("title")),
				index: Number(fd.get("index")),
				videoUrl: String(fd.get("videoUrl") || ""),
				content: String(fd.get("content") || ""),
			},
		});
	}

	async function importFromYouTubeAction(fd: FormData) {
		"use server";
		const input = String(fd.get("playlist") || "");
		const categoryId = String(fd.get("categoryId") || "");
		const max = Math.max(1, Math.min(200, Number(fd.get("max") || 50)));
		const playlistId = parsePlaylistId(input);

		const meta = await ytPlaylistInfo(playlistId);
		const items = await ytPlaylistItemsAll(playlistId, max);

		const slug = toSlug(meta.title || `yt-${playlistId}`);
		const course = await prisma.course.upsert({
			where: { youtubePlaylistId: playlistId },
			update: {
				title: meta.title,
				description: meta.description ?? "",
				thumbnail:
					meta.thumbnails?.high?.url ??
					meta.thumbnails?.medium?.url ??
					null,
				channelTitle: meta.channelTitle ?? null,
				slug,
				source: "YOUTUBE",
				updatedAt: new Date(),
			},
			create: {
				title: meta.title,
				slug,
				description: meta.description ?? "",
				thumbnail:
					meta.thumbnails?.high?.url ??
					meta.thumbnails?.medium?.url ??
					null,
				channelTitle: meta.channelTitle ?? null,
				source: "YOUTUBE",
				youtubePlaylistId: playlistId,
			},
		});

		
		if (categoryId) {
			await prisma.courseCategory.upsert({
				where: {
					courseId_categoryId: { courseId: course.id, categoryId },
				},
				update: {},
				create: { courseId: course.id, categoryId },
			});
		}

	
		let index = 1;
		for (const it of items) {
			const vid = it.contentDetails?.videoId as string | undefined;
			if (!vid) continue;
			const title = (it.snippet?.title as string) ?? `Video ${index}`;
			await prisma.lesson.upsert({
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
				
					videoUrl: null,
				},
			});
			index++;
		}
	}

	const courses = await prisma.course.findMany({
		orderBy: { updatedAt: "desc" },
		include: {
			categories: { include: { category: true } },
			_count: { select: { lessons: true } },
		},
	});

	const categories = await prisma.category.findMany({
		orderBy: { name: "asc" },
	});

	return (
		<div className="mx-auto max-w-4xl p-6 space-y-10">
			<section className="rounded-2xl border p-4">
				<h2 className="mb-2 text-lg font-semibold">
					Create course (Admin)
				</h2>
				<form
					action={createCourseAction}
					className="grid grid-cols-1 gap-3 sm:grid-cols-2">
					<input
						name="title"
						placeholder="Title"
						className="rounded-xl border p-2"
						required
					/>
					<input
						name="slug"
						placeholder="Slug (auto if blank)"
						className="rounded-xl border p-2"
					/>
					<textarea
						name="description"
						placeholder="Description"
						className="rounded-xl border p-2 sm:col-span-2"
					/>
					<input
						name="thumbnail"
						placeholder="Thumbnail URL (optional)"
						className="rounded-xl border p-2 sm:col-span-2"
					/>
					<SubmitButton>Create</SubmitButton>
				</form>
			</section>

			<section className="rounded-2xl border p-4">
				<h2 className="mb-2 text-lg font-semibold">
					Add lesson (Admin)
				</h2>
				<form
					action={createLessonAction}
					className="grid grid-cols-1 gap-3 sm:grid-cols-2">
					<select
						name="courseId"
						className="rounded-xl border p-2"
						required>
						{courses.map((c) => (
							<option key={c.id} value={c.id}>
								{c.title}
							</option>
						))}
					</select>
					<input
						name="title"
						placeholder="Title"
						className="rounded-xl border p-2"
						required
					/>
					<input
						name="index"
						type="number"
						placeholder="Index"
						className="rounded-xl border p-2"
						required
					/>
					<input
						name="videoUrl"
						placeholder="MP4 URL (for admin uploads)"
						className="rounded-xl border p-2 sm:col-span-2"
					/>
					<textarea
						name="content"
						placeholder="HTML/markdown (optional)"
						className="rounded-xl border p-2 sm:col-span-2"
					/>
					<SubmitButton>Add</SubmitButton>
				</form>
			</section>

			<section className="rounded-2xl border p-4">
				<h2 className="mb-2 text-lg font-semibold">
					Import from YouTube (Playlist → Course)
				</h2>
				<form
					action={importFromYouTubeAction}
					className="grid grid-cols-1 gap-3 sm:grid-cols-2">
					<input
						name="playlist"
						placeholder="Playlist URL or ID (e.g., https://www.youtube.com/playlist?list=PL...)"
						className="rounded-xl border p-2 sm:col-span-2"
						required
					/>
					<select name="categoryId" className="rounded-xl border p-2">
						<option value="">(no category)</option>
						{categories.map((cat) => (
							<option key={cat.id} value={cat.id}>
								{cat.name}
							</option>
						))}
					</select>
					<input
						name="max"
						type="number"
						defaultValue={50}
						min={1}
						max={200}
						className="rounded-xl border p-2"
					/>
					<SubmitButton>Import playlist</SubmitButton>
				</form>
				<p className="mt-2 text-xs text-gray-600">
					We’ll create (or update) a course for the playlist and add
					lessons for each video. Safe to re-run; it upserts.
				</p>
			</section>
		</div>
	);
}
