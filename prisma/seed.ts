import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function upsertCategory(slug: string, name: string) {
	return db.category.upsert({
		where: { slug },
		update: { name },
		create: { slug, name },
	});
}

type LessonSeed = {
	title: string;
	index: number;
	videoUrl: string;
	content?: string;
};
type CourseSeed = {
	title: string;
	slug: string;
	description: string;
	thumbnail?: string;
	categories: string[]; // category slugs
	lessons: LessonSeed[];
};

const COURSES: CourseSeed[] = [
	{
		title: "Next.js 15 Basics",
		slug: "nextjs-15-basics",
		description:
			"Kickstart frontend with Next.js 15 + TypeScript. Routing, data, server actions.",
		thumbnail: "",
		categories: ["frontend"],
		lessons: [
			{
				title: "Intro & Project Setup",
				index: 1,
				videoUrl: "https://example.com/nextjs/intro.mp4",
			},
			{
				title: "App Router Deep Dive",
				index: 2,
				videoUrl: "https://example.com/nextjs/router.mp4",
			},
			{
				title: "Server Actions 101",
				index: 3,
				videoUrl: "https://example.com/nextjs/actions.mp4",
			},
		],
	},
	{
		title: "Node.js APIs with Prisma",
		slug: "node-api-prisma",
		description:
			"Build robust REST endpoints with Node, Prisma, and Postgres.",
		thumbnail: "",
		categories: ["backend"],
		lessons: [
			{
				title: "API Design & Tooling",
				index: 1,
				videoUrl: "https://example.com/node/api-design.mp4",
			},
			{
				title: "Prisma Models & Migrations",
				index: 2,
				videoUrl: "https://example.com/node/prisma.mp4",
			},
			{
				title: "Auth & Middleware",
				index: 3,
				videoUrl: "https://example.com/node/auth.mp4",
			},
		],
	},
	{
		title: "DSA Bootcamp (JS)",
		slug: "dsa-bootcamp-js",
		description:
			"Master arrays, hash maps, stacks/queues, trees, and graphs with JavaScript.",
		thumbnail: "",
		categories: ["dsa"],
		lessons: [
			{
				title: "Big-O & Arrays",
				index: 1,
				videoUrl: "https://example.com/dsa/arrays.mp4",
			},
			{
				title: "Hash Maps & Sets",
				index: 2,
				videoUrl: "https://example.com/dsa/hashmaps.mp4",
			},
			{
				title: "Trees & Traversals",
				index: 3,
				videoUrl: "https://example.com/dsa/trees.mp4",
			},
		],
	},
	{
		title: "SQL Fundamentals",
		slug: "sql-fundamentals",
		description:
			"From SELECT to JOINs, aggregations, and indexing best practices.",
		thumbnail: "",
		categories: ["backend"],
		lessons: [
			{
				title: "Relational Basics",
				index: 1,
				videoUrl: "https://example.com/sql/basics.mp4",
			},
			{
				title: "JOINS & Aggregations",
				index: 2,
				videoUrl: "https://example.com/sql/joins.mp4",
			},
			{
				title: "Indexes & Query Plans",
				index: 3,
				videoUrl: "https://example.com/sql/indexes.mp4",
			},
		],
	},
];

async function upsertCourseWithLessons(
	c: CourseSeed,
	catIdsBySlug: Record<string, string>
) {
	// Create or fetch the course by slug
	const course = await db.course.upsert({
		where: { slug: c.slug },
		update: {
			title: c.title,
			description: c.description,
			thumbnail: c.thumbnail ?? null,
			updatedAt: new Date(),
		},
		create: {
			title: c.title,
			slug: c.slug,
			description: c.description,
			thumbnail: c.thumbnail ?? null,
		},
	});

	// Ensure lessons exist (unique by (courseId, index))
	for (const L of c.lessons) {
		await db.lesson.upsert({
			where: { courseId_index: { courseId: course.id, index: L.index } },
			update: {
				title: L.title,
				videoUrl: L.videoUrl,
				content: L.content ?? null,
				updatedAt: new Date(),
			},
			create: {
				courseId: course.id,
				title: L.title,
				index: L.index,
				videoUrl: L.videoUrl,
				content: L.content ?? null,
			},
		});
	}

	// Connect categories via the join table (CourseCategory)
	for (const slug of c.categories) {
		const categoryId = catIdsBySlug[slug];
		if (!categoryId) continue;
		await db.courseCategory.upsert({
			where: { courseId_categoryId: { courseId: course.id, categoryId } },
			update: {},
			create: { courseId: course.id, categoryId },
		});
	}

	return course;
}

async function main() {
	// 1) Categories (add any you like here)
	const categoryRecords = await Promise.all([
		upsertCategory("frontend", "Frontend"),
		upsertCategory("backend", "Backend"),
		upsertCategory("dsa", "DSA"),
		upsertCategory("devops", "DevOps"),
		upsertCategory("ai-ml", "AI/ML"),
	]);
	const catIdsBySlug = Object.fromEntries(
		categoryRecords.map((c) => [c.slug, c.id])
	);

	// 2) Courses + lessons + category links
	for (const c of COURSES) {
		await upsertCourseWithLessons(c, catIdsBySlug);
	}

	// 3) Optional: ensure an ordering sanity check
	const totalCourses = await db.course.count();
	const totalLessons = await db.lesson.count();
	const totalCategories = await db.category.count();

	console.log(
		`Seed complete: ${totalCourses} courses, ${totalLessons} lessons, ${totalCategories} categories.`
	);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await db.$disconnect();
	});
