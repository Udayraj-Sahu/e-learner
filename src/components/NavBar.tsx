"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import Button from "@/components/Button";

export default function NavBar() {
	const router = useRouter();
	const sp = useSearchParams();
	const [q, setQ] = useState("");

	useEffect(() => setQ(sp.get("q") ?? ""), [sp]);

	function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const params = new URLSearchParams(sp.toString());
		if (q) params.set("q", q);
		else params.delete("q");
		router.push(`/?${params.toString()}`);
	}

	return (
		<header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
			<div className="mx-auto flex max-w-6xl items-center gap-3 p-3 sm:p-4">
			
				<Link
					href="/"
					className="md:hidden text-lg font-semibold tracking-tight">
					rbas
				</Link>

				
				<form
					onSubmit={onSubmit}
					className="mx-auto flex w-full max-w-2xl items-center gap-2">
					<div className="flex w-full items-center gap-2 rounded-full border px-3 py-2">
						<Search className="h-4 w-4 text-gray-500" />
						<input
							value={q}
							onChange={(e) => setQ(e.target.value)}
							placeholder="Search courses (e.g., DSA, Next.js, SQL)…"
							className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
						/>
					</div>
					<Button
						type="submit"
						variant="outline"
						size="md"
						className="rounded-full">
						Search
					</Button>
				</form>

			
				<div className="ml-auto flex items-center gap-2">
					<SignedOut>
						<Button variant="outline" size="sm">
							<Link href="/sign-in">Sign in</Link>
						</Button>
					</SignedOut>
					<SignedIn>
						<Button
							variant="outline"
							size="sm"
							className="hidden sm:inline">
							<Link href="/dashboard">Dashboard</Link>
						</Button>
						<UserButton
							appearance={{ elements: { avatarBox: "w-8 h-8" } }}
						/>
					</SignedIn>
				</div>
			</div>
		</header>
	);
}
