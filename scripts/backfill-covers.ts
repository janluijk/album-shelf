import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { lookupCoverUrl } from "../src/lib/coverArt";

const musicBrainzRateLimitMs = 1100;

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not set");

  const sql = neon(databaseUrl);
  const rows = (await sql`
    select id, title, artist from album where cover_url is null order by id
  `) as { id: number; title: string; artist: string }[];
  console.log(`${rows.length} albums without cover art`);

  for (const row of rows) {
    const coverUrl = await lookupCoverUrl(row.title, row.artist);
    if (coverUrl) {
      await sql`update album set cover_url = ${coverUrl} where id = ${row.id}`;
    }
    console.log(
      `#${row.id} ${row.artist} — ${row.title}: ${coverUrl ?? "no match"}`,
    );
    await new Promise((resolve) => setTimeout(resolve, musicBrainzRateLimitMs));
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
