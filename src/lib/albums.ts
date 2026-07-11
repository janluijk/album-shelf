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

export function reorderQueue<T extends AlbumLike & { id: number }>(
  queue: T[],
  draggedId: number,
  targetId: number,
): PositionSwap[] {
  const sorted = [...queue].sort((a, b) => a.position - b.position);
  const from = sorted.findIndex((album) => album.id === draggedId);
  const to = sorted.findIndex((album) => album.id === targetId);
  const isNoOp = from === -1 || to === -1 || from === to;
  if (isNoOp) return [];

  const positions = sorted.map((album) => album.position);
  const [moved] = sorted.splice(from, 1);
  sorted.splice(to, 0, moved);
  return sorted
    .map((album, index) => ({ id: album.id, position: positions[index] }))
    .filter((swap, index) => sorted[index].position !== swap.position);
}

export function isValidRating(value: unknown): value is number {
  return (
    typeof value === "number" &&
    value >= 1 &&
    value <= 5 &&
    Math.round(value * 10) / 10 === value
  );
}
