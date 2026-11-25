import { describe, it } from "vitest";
import { expectMoves, setup } from "../helpers";

describe("getAvailableMoves", () => {
  describe("bishop", () => {
    it("slides diagonally to the edge of the board", () => {
      const game = setup([
        { x: 4, y: 0, piece: "wk" }, { x: 4, y: 7, piece: "bk" },
        { x: 3, y: 3, piece: "wb" },
      ]);

      expectMoves(game, { x: 3, y: 3 }, [
        { x: 2, y: 2 }, { x: 1, y: 1 }, { x: 0, y: 0 },
        { x: 4, y: 4 }, { x: 5, y: 5 }, { x: 6, y: 6 }, { x: 7, y: 7 },
        { x: 2, y: 4 }, { x: 1, y: 5 }, { x: 0, y: 6 },
        { x: 4, y: 2 }, { x: 5, y: 1 }, { x: 6, y: 0 },
      ]);
    });

    it("stops before own pieces and on enemy pieces", () => {
      const game = setup([
        { x: 4, y: 0, piece: "wk" }, { x: 4, y: 7, piece: "bk" },
        { x: 3, y: 3, piece: "wb" },
        { x: 5, y: 5, piece: "wp" }, // own
        { x: 1, y: 1, piece: "bn" }, // enemy
      ]);

      expectMoves(game, { x: 3, y: 3 }, [
        { x: 2, y: 2 }, { x: 1, y: 1 },
        { x: 4, y: 4 },
        { x: 2, y: 4 }, { x: 1, y: 5 }, { x: 0, y: 6 },
        { x: 4, y: 2 }, { x: 5, y: 1 }, { x: 6, y: 0 },
      ]);
    });

    it("moves only along the pin line when pinned, so the king stays out of check", () => {
      const game = setup([
        { x: 4, y: 0, piece: "wk" }, { x: 7, y: 7, piece: "bk" },
        // The queen on (7, 3) pins the bishop on (5, 1) along the diagonal.
        { x: 5, y: 1, piece: "wb" }, { x: 7, y: 3, piece: "bq" },
      ]);

      expectMoves(game, { x: 5, y: 1 }, [{ x: 6, y: 2 }, { x: 7, y: 3 }]);
    });
  });
});
