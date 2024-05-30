import { db } from "@/db/db";
import { urls } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic"; // defaults to auto

export async function PATCH(request: Request) {
  const { shortUrl, redirectUrl } = await request.json();

  const result = await db.update(urls).set({ longUrl: redirectUrl }).where(eq(urls.shortUrl, shortUrl));

  return new Response(JSON.stringify(result));
}

