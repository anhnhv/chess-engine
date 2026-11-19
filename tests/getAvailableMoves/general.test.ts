import { describe, expect, it } from "vitest";
import { expectMoves, setup } from "../helpers";

describe("getAvailableMoves", () => {
  describe("general", () => {
    it("returns no moves for an empty square", () => {
      const game = setup([
        { x: 4, y: 0, piece: "wk" }, { x: 4, y: 7, piece: "bk" },
        { x: 4, y: 1, piece: "wp" },
      ]);

      expectMoves(game, { x: 4, y: 3 }, []);
      // The board itself is not empty: the pawn on (4, 1) can still move.
      expectMoves(game, { x: 4, y: 1 }, [{ x: 4, y: 2 }, { x: 4, y: 3 }]);
    });

    it("throws for a coordinate off the board", () => {
      const game = setup([
        { x: 4, y: 0, piece: "wk" }, { x: 4, y: 7, piece: "bk" },
      ]);

      expect(() => game.getAvailableMoves({ x: 8, y: 0 })).toThrow();
      expect(() => game.getAvailableMoves({ x: 0, y: -1 })).toThrow();
    });
  });
});
