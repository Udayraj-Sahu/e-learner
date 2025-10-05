"use client";
import Link from "next/link";
import Image from "next/image";
import { Card } from "./Card";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

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
	const card = useRef<HTMLDivElement>(null);
	const { contextSafe } = useGSAP({ scope: card });

	const onEnter = contextSafe(() => {
		gsap.to(card.current, {
			y: -8,
			scale: 1.02,
			boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
			duration: 0.3,
			ease: "power2.out",
		});
	});

	const onLeave = contextSafe(() => {
		gsap.to(card.current, {
			y: 0,
			scale: 1,
			boxShadow:
				"0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
			duration: 0.3,
			ease: "power2.out",
		});
	});

	return (
		<Link
			href={`/course/${slug}`}
			className="block"
			onMouseEnter={onEnter}
			onMouseLeave={onLeave}>
			<Card ref={card}>
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
