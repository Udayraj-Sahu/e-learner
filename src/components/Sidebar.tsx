import Link from "next/link";
import { prisma } from "../../lib/prisma";
import { Home, Code2, Database, Network, Layers } from "lucide-react";


const ORDER = ["frontend", "backend", "ai-ml", "dsa"] as const;

const ICONS: Record<string, React.ReactNode> = {
	frontend: <Code2 className="h-4 w-4" />,
	backend: <Database className="h-4 w-4" />,
	"ai-ml": <Network className="h-4 w-4" />,
	dsa: <Layers className="h-4 w-4" />,
};

export default async function Sidebar() {

	const cats = await prisma.category.findMany({
		where: { slug: { in: [...ORDER] } },
	});
	cats.sort(
		(a, b) => ORDER.indexOf(a.slug as any) - ORDER.indexOf(b.slug as any)
	);

	return (
		<div className="flex h-screen flex-col p-4">
			<Link
				href="/"
				className="block text-2xl font-semibold tracking-tight">
				<span className="text-brand">r</span>bas
			</Link>

			<div className="mt-6">
				<p className="mb-2 text-xs font-semibold uppercase text-gray-500">
					Browse
				</p>
				<nav className="space-y-1">
					<SidebarLink href="/" icon={<Home className="h-4 w-4" />}>
						All
					</SidebarLink>
					{cats.map((c) => (
						<SidebarLink
							key={c.id}
							href={`/?cat=${c.slug}`}
							icon={
								ICONS[c.slug] ?? <Layers className="h-4 w-4" />
							}>
							{c.name}
						</SidebarLink>
					))}
				</nav>
			</div>

			<div className="mt-auto pt-4 text-xs text-gray-500">
				<p>© {new Date().getFullYear()} rbas</p>
			</div>
		</div>
	);
}

function SidebarLink({
	href,
	icon,
	children,
}: {
	href: string;
	icon?: React.ReactNode;
	children: React.ReactNode;
}) {
	return (
		<Link
			href={href}
			className="group flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-700 hover:bg-gray-100">
			<span className="text-gray-500 group-hover:text-gray-700">
				{icon}
			</span>
			<span>{children}</span>
		</Link>
	);
}
