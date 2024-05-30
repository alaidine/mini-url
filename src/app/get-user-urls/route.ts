import { db } from "@/db/db";
import { urls } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic"; // defaults to auto

export async function POST(request: Request) {
  const { userId } = await request.json();

  const result = await db.select().from(urls).where(eq(urls.userId, userId));

  return new Response(JSON.stringify(result));
}
