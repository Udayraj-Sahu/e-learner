// app/ui/AuthSync.tsx
import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "../../lib/prisma";

export default async function AuthSync() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await currentUser();
  const email =
    user?.emailAddresses?.[0]?.emailAddress ??
    `${userId}@placeholder.local`;

  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || null;
  const imageUrl = user?.imageUrl || null;

  await prisma.userProfile.upsert({
    where: { clerkId: userId },
    update: { email, name, imageUrl },
    create: { clerkId: userId, email, name, imageUrl },
  });

  return null;
}
