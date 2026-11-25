import { describe, it } from "vitest";
import { expectMoves, setup } from "../helpers";

describe("getAvailableMoves", () => {
  describe("queen", () => {
    it("combines the moves of a rook and a bishop", () => {
      const game = setup([
        { x: 4, y: 0, piece: "wk" }, { x: 4, y: 7, piece: "bk" },
        { x: 3, y: 3, piece: "wq" },
      ]);

      expectMoves(game, { x: 3, y: 3 }, [
        // like a rook
        { x: 0, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 3 },
        { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 6, y: 3 }, { x: 7, y: 3 },
        { x: 3, y: 0 }, { x: 3, y: 1 }, { x: 3, y: 2 },
        { x: 3, y: 4 }, { x: 3, y: 5 }, { x: 3, y: 6 }, { x: 3, y: 7 },
        // like a bishop
        { x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 },
        { x: 4, y: 4 }, { x: 5, y: 5 }, { x: 6, y: 6 }, { x: 7, y: 7 },
        { x: 0, y: 6 }, { x: 1, y: 5 }, { x: 2, y: 4 },
        { x: 4, y: 2 }, { x: 5, y: 1 }, { x: 6, y: 0 },
      ]);
    });

    it("stops before own pieces and on enemy pieces", () => {
      const game = setup([
        { x: 4, y: 0, piece: "wk" }, { x: 4, y: 7, piece: "bk" },
        { x: 3, y: 3, piece: "wq" },
        { x: 3, y: 5, piece: "wp" }, { x: 1, y: 3, piece: "wn" }, // own
        { x: 5, y: 5, piece: "bp" }, // enemy
      ]);

      expectMoves(game, { x: 3, y: 3 }, [
        { x: 3, y: 4 },
        { x: 3, y: 2 }, { x: 3, y: 1 }, { x: 3, y: 0 },
        { x: 2, y: 3 },
        { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 6, y: 3 }, { x: 7, y: 3 },
        { x: 4, y: 4 }, { x: 5, y: 5 },
        { x: 2, y: 2 }, { x: 1, y: 1 }, { x: 0, y: 0 },
        { x: 2, y: 4 }, { x: 1, y: 5 }, { x: 0, y: 6 },
        { x: 4, y: 2 }, { x: 5, y: 1 }, { x: 6, y: 0 },
      ]);
    });

    it("moves only along the pin line when pinned, so the king stays out of check", () => {
      const game = setup([
        { x: 4, y: 0, piece: "wk" }, { x: 7, y: 7, piece: "bk" },
        // The rook on (4, 6) pins the queen on (4, 2) along column x = 4.
        { x: 4, y: 2, piece: "wq" }, { x: 4, y: 6, piece: "br" },
      ]);

      expectMoves(game, { x: 4, y: 2 }, [
        { x: 4, y: 1 }, { x: 4, y: 3 }, { x: 4, y: 4 }, { x: 4, y: 5 }, { x: 4, y: 6 },
      ]);
    });
  });
});
