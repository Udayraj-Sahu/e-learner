
import { auth } from "@clerk/nextjs/server";
import db, { prisma } from "../../../../lib/prisma";
import SubmitButton from "@/components/SubmitButton";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
	params: { slug: string };
};

export async function generateMetadata(
	{ params }: Props,
	_parent: ResolvingMetadata
): Promise<Metadata> {
	const course = await db.course.findUnique({
		where: { slug: params.slug },
	});

	return {
		title: course?.title ?? "Course",
		description: course?.description,
	};
}

type Params = Promise<{ slug: string }>;

export default async function CoursePage({ params }: { params: Params }) {
	const { slug } = await params;
	const course = await db.course.findUnique({
		where: { slug },
		include: { lessons: { orderBy: { index: "asc" } } },
	});

	if (!course) return <div className="p-6">Not Founded</div>;

	const { userId } = await auth();
	const profile = userId
		? await prisma.userProfile.findUnique({ where: { clerkId: userId } })
		: null;

	const enrolled = profile
		? !!(await prisma.enrollment.findUnique({
				where: {
					userId_courseId: {
						userId: profile.id,
						courseId: course.id,
					},
				},
		  }))
		: false;

	async function enrollAction(formData: FormData) {
		"use server";
		const cId = String(formData.get("courseId"));
		const { userId } = await auth();
		if (!userId) return;
		let profile = await prisma.userProfile.findUnique({
			where: { clerkId: userId },
		});
		if (!profile) {
		
			profile = await prisma.userProfile.create({
				data: { clerkId: userId, email: "" },
			});
		}
		await prisma.enrollment.upsert({
			where: { userId_courseId: { userId: profile.id, courseId: cId } },
			update: {},
			create: { userId: profile.id, courseId: cId },
		});
	}

	return (
		<div className="max-w-3xl mx-auto p-6">
			<h1 className="text-3xl font-bold">{course.title}</h1>
			<p className="mt-2 text-gray-700">{course.description}</p>

			{!enrolled ? (
				<form action={enrollAction} className="mt-4">
					<input type="hidden" name="courseId" value={course.id} />
					<SubmitButton>Enroll</SubmitButton>
				</form>
			) : (
				<a
					href={`/course/${course.slug}/lesson/${course.lessons[0]?.id}`}
					className="inline-block mt-4 rounded-xl border px-4 py-2">
					Start Learning
				</a>
			)}

			<h2 className="mt-8 mb-2 font-semibold">Lessons</h2>
			<ul className="space-y-2">
				{course.lessons.map((l) => (
					<li key={l.id} className="rounded-lg border p-3">
						{l.index}. {l.title}
					</li>
				))}
			</ul>
		</div>
	);
}
