
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/NavBar";
import AuthSync from "@/components/AuthSync";
import PageWrapper from "@/components/PageWrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: {
		template: "%s | e-Learner",
		default: "e-Learner - Your Gateway to Knowledge",
	},
	description:
		"Explore a wide range of courses on Next.js, Node.js, DSA, and more. Start your learning journey with e-Learner.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider>
			<html lang="en" suppressHydrationWarning>
				<body className="min-h-screen bg-white text-gray-900 antialiased">
					<AuthSync />
					<PageWrapper>
						<div className="grid min-h-screen grid-cols-1 md:grid-cols-[240px_1fr]">
							<aside className="hidden border-r bg-white md:block">
								<Sidebar />
							</aside>
							<div className="flex min-h-screen flex-col">
								<TopNav />
								<main className="mx-auto w-full max-w-6xl flex-1 p-4 sm:p-6">
									{children}
								</main>
							</div>
						</div>
					</PageWrapper>
				</body>
			</html>
		</ClerkProvider>
	);
}
