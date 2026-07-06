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

export type PositionSwap = {
  id: number;
  position: number;
};

export function swapWithNeighbor<T extends AlbumLike & { id: number }>(
  queue: T[],
  id: number,
  direction: "up" | "down",
): [PositionSwap, PositionSwap] | null {
  const sorted = [...queue].sort((a, b) => a.position - b.position);
  const index = sorted.findIndex((album) => album.id === id);
  if (index === -1) return null;

  const neighbor = sorted[direction === "up" ? index - 1 : index + 1];
  if (!neighbor) return null;

  const current = sorted[index];
  return [
    { id: current.id, position: neighbor.position },
    { id: neighbor.id, position: current.position },
  ];
}

export function isValidRating(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= 5
  );
}
