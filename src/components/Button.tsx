"use client";

import clsx from "clsx";
import React from "react";

type Variant = "primary" | "outline" | "ghost" | "subtle";
type Size = "sm" | "md";

export default function Button({
	as = "button",
	variant = "primary",
	size = "md",
	className,
	...props
}: React.ComponentProps<"button"> & {
	as?: "button" | "a";
	variant?: Variant;
	size?: Size;
}) {
	const base =
		"inline-flex items-center justify-center rounded-xl transition";
	const sizes = {
		sm: "h-8 px-3 text-xs",
		md: "h-10 px-4 text-sm",
	}[size];

	const variants = {
		primary:
			"bg-brand text-white hover:bg-brand-700 active:translate-y-[1px]",
		outline:
			"border text-gray-900 hover:bg-gray-50 active:translate-y-[1px]",
		ghost: "text-gray-700 hover:bg-gray-100 active:translate-y-[1px]",
		subtle: "bg-gray-100 text-gray-900 hover:bg-gray-200 active:translate-y-[1px]",
	}[variant];

	return React.createElement(as, {
		className: clsx(base, sizes, variants, className),
		...props,
	});
}
