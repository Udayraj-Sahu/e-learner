import Skeleton from "@/components/Skeleton";

export default function Loading() {
	return (
		<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{Array.from({ length: 6 }).map((_, i) => (
				<div key={i} className="rounded-2xl border bg-white p-0">
					<Skeleton className="aspect-video w-full rounded-t-2xl" />
					<div className="space-y-3 p-4">
						<Skeleton className="h-4 w-3/4" />
						<Skeleton className="h-3 w-full" />
						<Skeleton className="h-3 w-5/6" />
						<div className="flex gap-2">
							<Skeleton className="h-5 w-14 rounded-full" />
							<Skeleton className="h-5 w-16 rounded-full" />
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
