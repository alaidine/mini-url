import { db } from "@/db/db";
import { urls } from "@/db/schema";

export const dynamic = "force-dynamic"; // defaults to auto

export async function POST(request: Request) {
  const { longUrl, shortUrl, userId } = await request.json();

  const result = await db.insert(urls).values({
    longUrl,
    shortUrl,
    userId,
  });

  return new Response(JSON.stringify(result));
}
