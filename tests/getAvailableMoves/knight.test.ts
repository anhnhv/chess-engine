import { describe, it } from "vitest";
import { KNIGHT_IN_CENTRE_MOVES, expectMoves, setup } from "../helpers";

describe("getAvailableMoves", () => {
  describe("knight", () => {
    it("moves in an L-shape to all 8 squares from the centre", () => {
      const game = setup([
        { x: 4, y: 0, piece: "wk" }, { x: 4, y: 7, piece: "bk" },
        { x: 3, y: 3, piece: "wn" },
      ]);

      expectMoves(game, { x: 3, y: 3 }, KNIGHT_IN_CENTRE_MOVES);
    });

    it("has only two moves from a corner", () => {
      const game = setup([
        { x: 4, y: 0, piece: "wk" }, { x: 4, y: 7, piece: "bk" },
        { x: 0, y: 0, piece: "wn" },
      ]);

      expectMoves(game, { x: 0, y: 0 }, [{ x: 1, y: 2 }, { x: 2, y: 1 }]);
    });

    it("jumps over surrounding pieces", () => {
      const game = setup([
        { x: 4, y: 0, piece: "wk" }, { x: 4, y: 7, piece: "bk" },
        { x: 3, y: 3, piece: "wn" },
        // own pawns on all 8 squares around the knight
        { x: 2, y: 2, piece: "wp" }, { x: 2, y: 3, piece: "wp" }, { x: 2, y: 4, piece: "wp" },
        { x: 3, y: 2, piece: "wp" }, { x: 3, y: 4, piece: "wp" },
        { x: 4, y: 2, piece: "wp" }, { x: 4, y: 3, piece: "wp" }, { x: 4, y: 4, piece: "wp" },
      ]);

      expectMoves(game, { x: 3, y: 3 }, KNIGHT_IN_CENTRE_MOVES);
    });

    it("captures enemy pieces but not own pieces", () => {
      const game = setup([
        { x: 4, y: 0, piece: "wk" }, { x: 4, y: 7, piece: "bk" },
        { x: 3, y: 3, piece: "wn" },
        { x: 1, y: 2, piece: "wp" }, { x: 5, y: 4, piece: "wp" }, // own
        { x: 2, y: 5, piece: "bp" }, { x: 4, y: 5, piece: "bb" }, // enemy
      ]);

      expectMoves(game, { x: 3, y: 3 }, [
        { x: 1, y: 4 }, { x: 2, y: 1 }, { x: 2, y: 5 },
        { x: 4, y: 1 }, { x: 4, y: 5 }, { x: 5, y: 2 },
      ]);
    });

    it("does not move when pinned on a row, since every jump exposes the king", () => {
      const game = setup([
        { x: 0, y: 3, piece: "wk" }, { x: 7, y: 7, piece: "bk" },
        // The rook on (7, 3) pins the knight on (3, 3) along row y = 3.
        { x: 3, y: 3, piece: "wn" }, { x: 7, y: 3, piece: "br" },
      ]);

      expectMoves(game, { x: 3, y: 3 }, []);
    });
  });
});
