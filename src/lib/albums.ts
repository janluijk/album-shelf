export type AlbumLike = {
  listenedOn: string | null;
  position: number;
};

export function partitionAlbums<T extends AlbumLike>(albums: T[]) {
  const queue = albums
    .filter((album) => !album.listenedOn)
    .sort((a, b) => a.position - b.position);
  const history = albums
    .filter((album) => !!album.listenedOn)
    .sort((a, b) => b.listenedOn!.localeCompare(a.listenedOn!));
  return { queue, history };
}

export function nextPosition(albums: AlbumLike[]): number {
  const hasAlbums = albums.length > 0;
  if (!hasAlbums) return 1;
  return Math.max(...albums.map((album) => album.position)) + 1;
}

export function isValidRating(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= 5
  );
}
