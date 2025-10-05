
import { prisma } from "../../lib/prisma";
import CourseCard from "../components/CourseCard";
import { Metadata } from "next";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export const metadata: Metadata = {
	title: "All Courses",
	description:
		"Browse our extensive catalog of courses to find your next learning adventure.",
};

export default async function Home({
	searchParams,
}: {
	searchParams: SearchParams;
}) {
	const sp = await searchParams;
	const q = typeof sp.q === "string" ? sp.q : "";
	const cat = typeof sp.cat === "string" ? sp.cat : "";

	const courses = await prisma.course.findMany({
		where: {
			AND: [
				q
					? {
							OR: [
								{ title: { contains: q, mode: "insensitive" } },
								{
									description: {
										contains: q,
										mode: "insensitive",
									},
								},
							],
					  }
					: {},
				cat
					? { categories: { some: { category: { slug: cat } } } }
					: {},
			],
		},
		include: {
			categories: { include: { category: true } },
			_count: { select: { lessons: true } },
		},
		orderBy: { createdAt: "desc" },
	});

	return (
		<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{courses.map((c) => (
				<CourseCard
					key={c.id}
					id={c.id}
					slug={c.slug}
					title={c.title}
					description={c.description}
					thumbnail={c.thumbnail}
					categories={c.categories.map((cc) => ({
						id: cc.categoryId,
						name: cc.category.name,
					}))}
					lessonCount={c._count.lessons}
				/>
			))}
			{courses.length === 0 && (
				<div className="col-span-full rounded-2xl border p-6 text-center text-gray-600">
					No courses found. Try a different search or category.
				</div>
			)}
		</div>
	);
}
