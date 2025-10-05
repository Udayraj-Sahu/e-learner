import clsx from "clsx";

export function Card({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={clsx(
				"rounded-2xl border bg-white shadow-card transition hover:shadow",
				className
			)}
			{...props}
		/>
	);
}
