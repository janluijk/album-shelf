import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { lookupAlbumMetadata } from "../src/lib/coverArt";

const musicBrainzRateLimitMs = 1100;

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not set");

  const sql = neon(databaseUrl);
  const rows = (await sql`
    select id, title, artist from album
    where cover_url is null or release_year is null
    order by id
  `) as { id: number; title: string; artist: string }[];
  console.log(`${rows.length} albums with missing metadata`);

  for (const row of rows) {
    const metadata = await lookupAlbumMetadata(row.title, row.artist);
    await sql`
      update album set
        cover_url = coalesce(cover_url, ${metadata.coverUrl}),
        release_year = coalesce(release_year, ${metadata.releaseYear})
      where id = ${row.id}
    `;
    console.log(
      `#${row.id} ${row.artist} — ${row.title}: cover ${metadata.coverUrl ?? "no match"}, year ${metadata.releaseYear ?? "no match"}`,
    );
    await new Promise((resolve) => setTimeout(resolve, musicBrainzRateLimitMs));
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
