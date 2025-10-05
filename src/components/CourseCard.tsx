import Link from "next/link";
import Image from "next/image";
import { Card } from "./Card";

export default function CourseCard({
	id,
	slug,
	title,
	description,
	thumbnail,
	categories,
	lessonCount,
}: {
	id: string;
	slug: string;
	title: string;
	description: string;
	thumbnail?: string | null;
	categories: { id: string; name: string }[];
	lessonCount: number;
}) {
	return (
		<Link href={`/course/${slug}`} className="block">
			<Card>
				<div className="aspect-video w-full overflow-hidden rounded-t-2xl bg-gray-100">
					{thumbnail ? (
						<Image
							alt={title}
							src={thumbnail}
							width={640}
							height={360}
							className="h-full w-full object-cover transition group-hover:scale-[1.01]"
						/>
					) : null}
				</div>
				<div className="p-4">
					<h3 className="line-clamp-1 text-base font-semibold">
						{title}
					</h3>
					<p className="mt-1 line-clamp-2 text-sm text-gray-600">
						{description}
					</p>
					<div className="mt-2 flex flex-wrap gap-1">
						{categories.map((c) => (
							<span
								key={c.id}
								className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
								{c.name}
							</span>
						))}
					</div>
					<p className="mt-2 text-xs text-gray-500">
						{lessonCount} lesson(s)
					</p>
				</div>
			</Card>
		</Link>
	);
}
