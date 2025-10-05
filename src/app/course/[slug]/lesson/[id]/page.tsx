import { auth } from "@clerk/nextjs/server";
import prisma from "../../../../../../lib/prisma";
import SubmitButton from "@/components/SubmitButton";
import { redirect } from "next/navigation";

type Params = Promise<{ slug: string; id: string }>;

export default async function LessonPage({ params }: { params: Params }) {
	const { id, slug } = await params;
	const { userId } = await auth();
	if (!userId) redirect(`/sign-in?redirectUrl=/course/${slug}/lesson/${id}`);

	let profile = await prisma.userProfile.findUnique({
		where: { clerkId: userId },
	});

	if (!profile)
		profile = await prisma.userProfile.create({
			data: { clerkId: userId, email: "" },
		});

	const lesson = await prisma.lesson.findUnique({
		where: { id },
		include: {
			course: { include: { lessons: { orderBy: { index: "asc" } } } },
		},
	});

	if (!lesson) return <div>Not Found</div>;

	const lessons = lesson.course.lessons;
	const idx = lessons.findIndex((l) => l.id === lesson.id);
	const prev = idx > 0 ? lessons[idx - 1] : null;
	const next = idx < lessons.length - 1 ? lessons[idx + 1] : null;

	// ✅ Video handling: YouTube vs Uploaded video
	const isYouTube = !!lesson.youtubeVideoId;
	const videoNode = isYouTube ? (
		<div className="mt-4 aspect-video w-full overflow-hidden rounded-xl">
			<iframe
				className="h-full w-full"
				src={`https://www.youtube.com/embed/${lesson.youtubeVideoId}`}
				title={lesson.title}
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				allowFullScreen
			/>
		</div>
	) : (
		<video
			className="w-full mt-4 rounded-xl"
			controls
			src={lesson.videoUrl ?? ""}
		/>
	);

	async function markCompleteAction(formData: FormData) {
		"use server";
		const lessonId = String(formData.get("lessonId"));
		const { userId } = await auth();
		if (!userId) return;
		const profile = await prisma.userProfile.findUnique({
			where: { clerkId: userId },
		});
		if (!profile) return;
		await prisma.progress.upsert({
			where: { userId_lessonId: { userId: profile.id, lessonId } },
			update: { completed: true, completedAt: new Date() },
			create: {
				userId: profile.id,
				lessonId,
				completed: true,
				completedAt: new Date(),
			},
		});
	}

	return (
		<div className="max-w-3xl mx-auto p-6">
			<h1 className="text-2xl font-semibold">{lesson.title}</h1>

			{/* ✅ Video render */}
			{videoNode}

			<form action={markCompleteAction} className="mt-4">
				<input type="hidden" name="lessonId" value={lesson.id} />
				<SubmitButton>Mark as Complete</SubmitButton>
			</form>

			<div className="flex gap-2 mt-6">
				{prev && (
					<a
						className="rounded-xl border px-3 py-1"
						href={`/course/${slug}/lesson/${prev.id}`}>
						← {prev.title}
					</a>
				)}
				{next && (
					<a
						className="rounded-xl border px-3 py-1 ml-auto"
						href={`/course/${slug}/lesson/${next.id}`}>
						{next.title} →
					</a>
				)}
			</div>
		</div>
	);
}
