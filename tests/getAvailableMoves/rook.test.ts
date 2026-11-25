import { describe, it } from "vitest";
import { expectMoves, setup } from "../helpers";

describe("getAvailableMoves", () => {
  describe("rook", () => {
    it("slides along its row and column to the edge of the board", () => {
      const game = setup([
        { x: 4, y: 0, piece: "wk" }, { x: 4, y: 7, piece: "bk" },
        { x: 3, y: 3, piece: "wr" },
      ]);

      expectMoves(game, { x: 3, y: 3 }, [
        // along the row
        { x: 0, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 3 },
        { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 6, y: 3 }, { x: 7, y: 3 },
        // along the column
        { x: 3, y: 0 }, { x: 3, y: 1 }, { x: 3, y: 2 },
        { x: 3, y: 4 }, { x: 3, y: 5 }, { x: 3, y: 6 }, { x: 3, y: 7 },
      ]);
    });

    it("stops before own pieces and on enemy pieces", () => {
      const game = setup([
        { x: 4, y: 0, piece: "wk" }, { x: 4, y: 7, piece: "bk" },
        { x: 3, y: 3, piece: "wr" },
        { x: 3, y: 5, piece: "wp" }, // own
        { x: 5, y: 3, piece: "bp" }, // enemy
      ]);

      expectMoves(game, { x: 3, y: 3 }, [
        { x: 3, y: 4 },
        { x: 3, y: 2 }, { x: 3, y: 1 }, { x: 3, y: 0 },
        { x: 2, y: 3 }, { x: 1, y: 3 }, { x: 0, y: 3 },
        { x: 4, y: 3 }, { x: 5, y: 3 },
      ]);
    });

    it("does not move when pinned on a diagonal, since every move exposes the king", () => {
      const game = setup([
        { x: 4, y: 0, piece: "wk" }, { x: 7, y: 7, piece: "bk" },
        // The bishop on (7, 3) pins the rook on (5, 1) to the king.
        { x: 5, y: 1, piece: "wr" }, { x: 7, y: 3, piece: "bb" },
      ]);

      expectMoves(game, { x: 5, y: 1 }, []);
    });
  });
});
