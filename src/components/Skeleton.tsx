export default function Skeleton({ className = "" }: { className?: string }) {
	return (
		<div
			className={`relative overflow-hidden rounded-xl bg-gray-200 ${className}`}
			style={{
				backgroundImage:
					"linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.6) 50%, rgba(255,255,255,0) 100%)",
				backgroundSize: "200% 100%",
				animation: "shimmer 1.4s linear infinite",
			}}
		/>
	);
}
