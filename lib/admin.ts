
import { currentUser } from "@clerk/nextjs/server";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
	.split(",")
	.map((s) => s.trim().toLowerCase())
	.filter(Boolean);

export async function requireAdmin() {
	const user = await currentUser();
	const email = user?.emailAddresses?.[0]?.emailAddress?.toLowerCase();
	if (!email || !ADMIN_EMAILS.includes(email)) {
		return false; 
	}
	return true;
}
