// lib/getOrCreateProfile.ts
import { auth, currentUser }  from "@clerk/nextjs/server";
import {prisma} from '../lib/prisma'

export async function getOrCreateProfile() {
	const { userId } = await auth();
	if (!userId) return null;

	const user = await currentUser();
	const email =
		user?.emailAddresses?.[0]?.emailAddress ??
		`${userId}@placeholder.local`;
	const name =
		[user?.firstName, user?.lastName].filter(Boolean).join(" ") || null;
	const imageUrl = user?.imageUrl || null;

	try {
		// Idempotent: create if missing, else update basic fields
		return await prisma.userProfile.upsert({
			where: { clerkId: userId },
			update: { email, name, imageUrl },
			create: { clerkId: userId, email, name, imageUrl },
		});
	} catch {
		// Very rare: if two upserts collide, fetch the winner
		return await prisma.userProfile.findUnique({
			where: { clerkId: userId },
		});
	}
}
