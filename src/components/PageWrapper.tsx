"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function PageWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	const root = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (root.current) {
			gsap.fromTo(
				root.current,
				{ opacity: 0 },
				{ opacity: 1, duration: 0.5, ease: "power2.inOut" }
			);
		}
	}, []);

	return <div ref={root}>{children}</div>;
}
