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
	// Adding 96 more courses
	{
		title: "Advanced React Patterns",
		slug: "advanced-react-patterns",
		description:
			"Level up your React skills with advanced patterns and techniques.",
		thumbnail: "",
		categories: ["frontend"],
		lessons: [
			{
				title: "Higher-Order Components",
				index: 1,
				videoUrl: "https://example.com/react/hocs.mp4",
			},
			{
				title: "Render Props",
				index: 2,
				videoUrl: "https://example.com/react/render-props.mp4",
			},
			{
				title: "Compound Components",
				index: 3,
				videoUrl: "https://example.com/react/compound-components.mp4",
			},
		],
	},
	{
		title: "Vue.js for Beginners",
		slug: "vuejs-for-beginners",
		description:
			"A comprehensive introduction to the progressive JavaScript framework.",
		thumbnail: "",
		categories: ["frontend"],
		lessons: [
			{
				title: "Introduction to Vue",
				index: 1,
				videoUrl: "https://example.com/vue/intro.mp4",
			},
			{
				title: "Components and Props",
				index: 2,
				videoUrl: "https://example.com/vue/components.mp4",
			},
			{
				title: "State Management with Pinia",
				index: 3,
				videoUrl: "https://example.com/vue/pinia.mp4",
			},
		],
	},
	{
		title: "Angular Crash Course",
		slug: "angular-crash-course",
		description:
			"Get up to speed with Angular for building powerful web applications.",
		thumbnail: "",
		categories: ["frontend"],
		lessons: [
			{
				title: "Setting up Your First Angular App",
				index: 1,
				videoUrl: "https://example.com/angular/setup.mp4",
			},
			{
				title: "Understanding Modules and Components",
				index: 2,
				videoUrl: "https://example.com/angular/modules.mp4",
			},
			{
				title: "Services and Dependency Injection",
				index: 3,
				videoUrl: "https://example.com/angular/services.mp4",
			},
		],
	},
	{
		title: "Svelte for Beginners",
		slug: "svelte-for-beginners",
		description:
			"Learn the radical new approach to building user interfaces.",
		thumbnail: "",
		categories: ["frontend"],
		lessons: [
			{
				title: "Introduction to Svelte",
				index: 1,
				videoUrl: "https://example.com/svelte/intro.mp4",
			},
			{
				title: "Reactivity and State",
				index: 2,
				videoUrl: "https://example.com/svelte/reactivity.mp4",
			},
			{
				title: "Component Communication",
				index: 3,
				videoUrl: "https://example.com/svelte/communication.mp4",
			},
		],
	},
	{
		title: "Modern CSS Layouts",
		slug: "modern-css-layouts",
		description:
			"Master Flexbox, Grid, and other modern CSS layout techniques.",
		thumbnail: "",
		categories: ["frontend"],
		lessons: [
			{
				title: "Flexbox Fundamentals",
				index: 1,
				videoUrl: "https://example.com/css/flexbox.mp4",
			},
			{
				title: "CSS Grid Deep Dive",
				index: 2,
				videoUrl: "https://example.com/css/grid.mp4",
			},
			{
				title: "Responsive Design with Modern CSS",
				index: 3,
				videoUrl: "https://example.com/css/responsive.mp4",
			},
		],
	},
	{
		title: "Python for Everybody",
		slug: "python-for-everybody",
		description:
			"A comprehensive course on Python programming for beginners.",
		thumbnail: "",
		categories: ["backend"],
		lessons: [
			{
				title: "Introduction to Python",
				index: 1,
				videoUrl: "https://example.com/python/intro.mp4",
			},
			{
				title: "Data Structures",
				index: 2,
				videoUrl: "https://example.com/python/data-structures.mp4",
			},
			{
				title: "Functions and Modules",
				index: 3,
				videoUrl: "https://example.com/python/functions.mp4",
			},
		],
	},
	{
		title: "Django for Web Development",
		slug: "django-for-web-development",
		description:
			"Build powerful web applications with this high-level Python framework.",
		thumbnail: "",
		categories: ["backend"],
		lessons: [
			{
				title: "Getting Started with Django",
				index: 1,
				videoUrl: "https://example.com/django/intro.mp4",
			},
			{
				title: "Models and Databases",
				index: 2,
				videoUrl: "https://example.com/django/models.mp4",
			},
			{
				title: "Views and Templates",
				index: 3,
				videoUrl: "https://example.com/django/views.mp4",
			},
		],
	},
	{
		title: "Ruby on Rails: A Deep Dive",
		slug: "ruby-on-rails-deep-dive",
		description: "Master the framework for building web applications.",
		thumbnail: "",
		categories: ["backend"],
		lessons: [
			{
				title: "Rails Fundamentals",
				index: 1,
				videoUrl: "https://example.com/rails/fundamentals.mp4",
			},
			{
				title: "Active Record Basics",
				index: 2,
				videoUrl: "https://example.com/rails/active-record.mp4",
			},
			{
				title: "Building a RESTful API",
				index: 3,
				videoUrl: "https://example.com/rails/api.mp4",
			},
		],
	},
	{
		title: "Go for Beginners",
		slug: "go-for-beginners",
		description: "An introduction to the Go programming language.",
		thumbnail: "",
		categories: ["backend"],
		lessons: [
			{
				title: "Hello, Go!",
				index: 1,
				videoUrl: "https://example.com/go/hello.mp4",
			},
			{
				title: "Concurrency in Go",
				index: 2,
				videoUrl: "https://example.com/go/concurrency.mp4",
			},
			{
				title: "Building a Web Server",
				index: 3,
				videoUrl: "https://example.com/go/web-server.mp4",
			},
		],
	},
	{
		title: "MERN Stack from Scratch",
		slug: "mern-stack-from-scratch",
		description:
			"Build a full-stack application with MongoDB, Express, React, and Node.js.",
		thumbnail: "",
		categories: ["fullstack"],
		lessons: [
			{
				title: "Setting up the MERN Project",
				index: 1,
				videoUrl: "https://example.com/mern/setup.mp4",
			},
			{
				title: "Building the Backend API",
				index: 2,
				videoUrl: "https://example.com/mern/api.mp4",
			},
			{
				title: "Creating the React Frontend",
				index: 3,
				videoUrl: "https://example.com/mern/frontend.mp4",
			},
		],
	},
	{
		title: "Docker and Kubernetes: The Complete Guide",
		slug: "docker-and-kubernetes-complete-guide",
		description:
			"Deploy, manage, and scale applications with Docker and Kubernetes.",
		thumbnail: "",
		categories: ["devops"],
		lessons: [
			{
				title: "Introduction to Docker",
				index: 1,
				videoUrl: "https://example.com/docker/intro.mp4",
			},
			{
				title: "Kubernetes Fundamentals",
				index: 2,
				videoUrl: "https://example.com/kubernetes/fundamentals.mp4",
			},
			{
				title: "Deploying a Microservices App",
				index: 3,
				videoUrl: "https://example.com/devops/microservices.mp4",
			},
		],
	},
	{
		title: "AWS for Developers",
		slug: "aws-for-developers",
		description: "A practical guide to AWS for developers.",
		thumbnail: "",
		categories: ["devops"],
		lessons: [
			{
				title: "Introduction to AWS",
				index: 1,
				videoUrl: "https://example.com/aws/intro.mp4",
			},
			{
				title: "EC2 and S3",
				index: 2,
				videoUrl: "https://example.com/aws/ec2-s3.mp4",
			},
			{
				title: "Serverless with Lambda",
				index: 3,
				videoUrl: "https://example.com/aws/lambda.mp4",
			},
		],
	},
	{
		title: "React Native: Build Mobile Apps",
		slug: "react-native-build-mobile-apps",
		description: "Build native mobile apps with React Native.",
		thumbnail: "",
		categories: ["mobile"],
		lessons: [
			{
				title: "Getting Started with React Native",
				index: 1,
				videoUrl: "https://example.com/react-native/intro.mp4",
			},
			{
				title: "Navigation and Layouts",
				index: 2,
				videoUrl: "https://example.com/react-native/navigation.mp4",
			},
			{
				title: "Working with Native APIs",
				index: 3,
				videoUrl: "https://example.com/react-native/native-apis.mp4",
			},
		],
	},
	{
		title: "Flutter for Beginners",
		slug: "flutter-for-beginners",
		description:
			"Build beautiful, natively compiled applications for mobile, web, and desktop from a single codebase.",
		thumbnail: "",
		categories: ["mobile"],
		lessons: [
			{
				title: "Introduction to Flutter and Dart",
				index: 1,
				videoUrl: "https://example.com/flutter/intro.mp4",
			},
			{
				title: "Building Layouts",
				index: 2,
				videoUrl: "https://example.com/flutter/layouts.mp4",
			},
			{
				title: "State Management",
				index: 3,
				videoUrl: "https://example.com/flutter/state-management.mp4",
			},
		],
	},
	{
		title: "Data Science with Python",
		slug: "data-science-with-python",
		description:
			"Learn to use Pandas, NumPy, and Scikit-learn for data analysis and machine learning.",
		thumbnail: "",
		categories: ["ai-ml"],
		lessons: [
			{
				title: "Introduction to Pandas",
				index: 1,
				videoUrl: "https://example.com/data-science/pandas.mp4",
			},
			{
				title: "Data Visualization with Matplotlib",
				index: 2,
				videoUrl: "https://example.com/data-science/matplotlib.mp4",
			},
			{
				title: "Machine Learning with Scikit-learn",
				index: 3,
				videoUrl: "https://example.com/data-science/scikit-learn.mp4",
			},
		],
	},
	{
		title: "Deep Learning with TensorFlow",
		slug: "deep-learning-with-tensorflow",
		description: "Build and train neural networks with TensorFlow.",
		thumbnail: "",
		categories: ["ai-ml"],
		lessons: [
			{
				title: "Introduction to TensorFlow",
				index: 1,
				videoUrl: "https://example.com/tensorflow/intro.mp4",
			},
			{
				title: "Building a Neural Network",
				index: 2,
				videoUrl: "https://example.com/tensorflow/neural-network.mp4",
			},
			{
				title: "Convolutional Neural Networks",
				index: 3,
				videoUrl: "https://example.com/tensorflow/cnn.mp4",
			},
		],
	},
	{
		title: "PostgreSQL for Everybody",
		slug: "postgresql-for-everybody",
		description:
			"Master the world's most advanced open source relational database.",
		thumbnail: "",
		categories: ["backend"],
		lessons: [
			{
				title: "Getting Started with PostgreSQL",
				index: 1,
				videoUrl: "https://example.com/postgresql/intro.mp4",
			},
			{
				title: "Advanced SQL Queries",
				index: 2,
				videoUrl: "https://example.com/postgresql/advanced-sql.mp4",
			},
			{
				title: "Performance and Tuning",
				index: 3,
				videoUrl: "https://example.com/postgresql/performance.mp4",
			},
		],
	},
	{
		title: "MongoDB: The Complete Guide",
		slug: "mongodb-the-complete-guide",
		description: "Master MongoDB and build modern applications.",
		thumbnail: "",
		categories: ["backend"],
		lessons: [
			{
				title: "Introduction to NoSQL and MongoDB",
				index: 1,
				videoUrl: "https://example.com/mongodb/intro.mp4",
			},
			{
				title: "CRUD Operations",
				index: 2,
				videoUrl: "https://example.com/mongodb/crud.mp4",
			},
			{
				title: "Aggregation Framework",
				index: 3,
				videoUrl: "https://example.com/mongodb/aggregation.mp4",
			},
		],
	},
	{
		title: "JavaScript: The Hard Parts",
		slug: "javascript-the-hard-parts",
		description:
			"Deepen your understanding of closures, callbacks, and asynchronous JavaScript.",
		thumbnail: "",
		categories: ["frontend", "dsa"],
		lessons: [
			{
				title: "Closures and Scope",
				index: 1,
				videoUrl: "https://example.com/javascript/closures.mp4",
			},
			{
				title: "Asynchronous JavaScript",
				index: 2,
				videoUrl: "https://example.com/javascript/async.mp4",
			},
			{
				title: "Promises and Async/Await",
				index: 3,
				videoUrl: "https://example.com/javascript/promises.mp4",
			},
		],
	},
	{
		title: "Cybersecurity for Beginners",
		slug: "cybersecurity-for-beginners",
		description: "An introduction to the world of cybersecurity.",
		thumbnail: "",
		categories: ["devops"],
		lessons: [
			{
				title: "Fundamentals of Cybersecurity",
				index: 1,
				videoUrl: "https://example.com/cybersecurity/fundamentals.mp4",
			},
			{
				title: "Network Security",
				index: 2,
				videoUrl: "https://example.com/cybersecurity/network.mp4",
			},
			{
				title: "Ethical Hacking",
				index: 3,
				videoUrl: "https://example.com/cybersecurity/hacking.mp4",
			},
		],
	},
	// ... continue adding more courses ...
	{
		title: "UI/UX Design Fundamentals",
		slug: "ui-ux-design-fundamentals",
		description:
			"Learn the principles of user interface and user experience design.",
		thumbnail: "",
		categories: ["frontend"],
		lessons: [
			{
				title: "Introduction to UI/UX",
				index: 1,
				videoUrl: "https://example.com/design/intro.mp4",
			},
			{
				title: "Wireframing and Prototyping",
				index: 2,
				videoUrl: "https://example.com/design/wireframing.mp4",
			},
			{
				title: "User Research and Testing",
				index: 3,
				videoUrl: "https://example.com/design/research.mp4",
			},
		],
	},
	{
		title: "GraphQL: The Big Picture",
		slug: "graphql-the-big-picture",
		description:
			"Understand the fundamentals of GraphQL and how it differs from REST.",
		thumbnail: "",
		categories: ["backend", "fullstack"],
		lessons: [
			{
				title: "Introduction to GraphQL",
				index: 1,
				videoUrl: "https://example.com/graphql/intro.mp4",
			},
			{
				title: "Schemas and Types",
				index: 2,
				videoUrl: "https://example.com/graphql/schemas.mp4",
			},
			{
				title: "Queries and Mutations",
				index: 3,
				videoUrl: "https://example.com/graphql/queries.mp4",
			},
		],
	},
	{
		title: "WebAssembly: The Future of Web Development",
		slug: "webassembly-future-of-web",
		description:
			"Learn how WebAssembly is changing the landscape of web development.",
		thumbnail: "",
		categories: ["frontend", "backend"],
		lessons: [
			{
				title: "What is WebAssembly?",
				index: 1,
				videoUrl: "https://example.com/wasm/intro.mp4",
			},
			{
				title: "Using Rust with WebAssembly",
				index: 2,
				videoUrl: "https://example.com/wasm/rust.mp4",
			},
			{
				title: "Performance and Use Cases",
				index: 3,
				videoUrl: "https://example.com/wasm/performance.mp4",
			},
		],
	},
	// ... continue for 100 courses
];

// Generate the remaining courses to reach 100
const additionalCourses: CourseSeed[] = Array.from(
	{ length: 100 - COURSES.length },
	(_, i) => {
		const courseNum = COURSES.length + i + 1;
		const categories = [
			"frontend",
			"backend",
			"dsa",
			"devops",
			"ai-ml",
			"mobile",
			"fullstack",
		];
		const category = categories[i % categories.length];

		return {
			title: `Course ${courseNum}: The Complete Guide`,
			slug: `course-${courseNum}-the-complete-guide`,
			description: `This is a comprehensive course on topic ${courseNum}.`,
			thumbnail: "",
			categories: [category],
			lessons: [
				{
					title: `Lesson 1: Introduction`,
					index: 1,
					videoUrl: `https://example.com/course${courseNum}/lesson1.mp4`,
				},
				{
					title: `Lesson 2: Core Concepts`,
					index: 2,
					videoUrl: `https://example.com/course${courseNum}/lesson2.mp4`,
				},
				{
					title: `Lesson 3: Advanced Topics`,
					index: 3,
					videoUrl: `https://example.com/course${courseNum}/lesson3.mp4`,
				},
			],
		};
	}
);

COURSES.push(...additionalCourses);

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
		upsertCategory("mobile", "Mobile Development"),
		upsertCategory("fullstack", "Fullstack"),
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
