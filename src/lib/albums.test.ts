import { describe, expect, it } from "vitest";
import { isValidRating, nextPosition, partitionAlbums } from "./albums";

describe("partitionAlbums", () => {
  it("splits albums into queue and history", () => {
    const albums = [
      { listenedOn: null, position: 2 },
      { listenedOn: "2026-06-01", position: 1 },
      { listenedOn: null, position: 1 },
    ];
    const { queue, history } = partitionAlbums(albums);
    expect(queue).toHaveLength(2);
    expect(history).toHaveLength(1);
  });

  it("orders the queue by position", () => {
    const albums = [
      { listenedOn: null, position: 3 },
      { listenedOn: null, position: 1 },
      { listenedOn: null, position: 2 },
    ];
    const { queue } = partitionAlbums(albums);
    expect(queue.map((album) => album.position)).toEqual([1, 2, 3]);
  });

  it("orders history newest first", () => {
    const albums = [
      { listenedOn: "2026-01-01", position: 1 },
      { listenedOn: "2026-06-15", position: 2 },
      { listenedOn: "2026-03-10", position: 3 },
    ];
    const { history } = partitionAlbums(albums);
    expect(history.map((album) => album.listenedOn)).toEqual([
      "2026-06-15",
      "2026-03-10",
      "2026-01-01",
    ]);
  });
});

describe("nextPosition", () => {
  it("returns 1 for an empty shelf", () => {
    expect(nextPosition([])).toBe(1);
  });

  it("returns max position plus one", () => {
    const albums = [
      { listenedOn: null, position: 4 },
      { listenedOn: "2026-06-01", position: 9 },
    ];
    expect(nextPosition(albums)).toBe(10);
  });
});

describe("isValidRating", () => {
  it("accepts integers 1 through 5", () => {
    [1, 2, 3, 4, 5].forEach((rating) => {
      expect(isValidRating(rating)).toBe(true);
    });
  });

  it("rejects out-of-range and non-integer values", () => {
    [0, 6, 2.5, "3", null, undefined, NaN].forEach((rating) => {
      expect(isValidRating(rating)).toBe(false);
    });
  });
});
