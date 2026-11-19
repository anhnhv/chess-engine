import { describe, it } from "vitest";
import { expectMoves, setup } from "../helpers";

describe("getAvailableMoves", () => {
  describe("check and pins", () => {
    it("lets a pinned piece move only along the line of the pin", () => {
      const game = setup([
        { x: 4, y: 0, piece: "wk" }, { x: 7, y: 7, piece: "bk" },
        // rook pinned on column x = 4
        { x: 4, y: 3, piece: "wr" }, { x: 4, y: 7, piece: "br" },
        // knight pinned on a diagonal
        { x: 3, y: 1, piece: "wn" }, { x: 1, y: 3, piece: "bb" },
      ]);

      expectMoves(game, { x: 4, y: 3 }, [
        { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 4, y: 4 },
        { x: 4, y: 5 }, { x: 4, y: 6 }, { x: 4, y: 7 },
      ]);
      expectMoves(game, { x: 3, y: 1 }, []);
    });

    it("only allows moves that block or capture the checking piece", () => {
      const game = setup([
        { x: 4, y: 0, piece: "wk" }, { x: 7, y: 7, piece: "bk" },
        { x: 4, y: 7, piece: "br" }, // gives check along column x = 4
        { x: 0, y: 3, piece: "wr" }, { x: 5, y: 5, piece: "wn" }, { x: 7, y: 1, piece: "wp" },
      ]);

      expectMoves(game, { x: 0, y: 3 }, [{ x: 4, y: 3 }]);
      expectMoves(game, { x: 5, y: 5 }, [{ x: 4, y: 3 }, { x: 4, y: 7 }]);
      expectMoves(game, { x: 7, y: 1 }, []);
    });

    it("does not let the king retreat along the line of a checking piece", () => {
      const game = setup([
        { x: 4, y: 1, piece: "wk" }, { x: 7, y: 7, piece: "bk" },
        { x: 4, y: 7, piece: "br" }, // attacks (4, 0) through the king too
      ]);

      expectMoves(game, { x: 4, y: 1 }, [
        { x: 3, y: 0 }, { x: 3, y: 1 }, { x: 3, y: 2 },
        { x: 5, y: 0 }, { x: 5, y: 1 }, { x: 5, y: 2 },
      ]);
    });

    it("lets the king escape check by capturing an undefended checking piece", () => {
      const game = setup([
        { x: 4, y: 0, piece: "wk" }, { x: 7, y: 7, piece: "bk" },
        { x: 4, y: 1, piece: "bq" },
      ]);

      expectMoves(game, { x: 4, y: 0 }, [{ x: 4, y: 1 }]);
    });

    it("only lets the king move when in double check", () => {
      const game = setup([
        { x: 4, y: 0, piece: "wk" }, { x: 7, y: 7, piece: "bk" },
        { x: 4, y: 7, piece: "br" }, { x: 3, y: 2, piece: "bn" }, // both give check
        { x: 0, y: 3, piece: "wr" }, // could block the rook, but not the knight
        { x: 1, y: 0, piece: "wb" }, // could capture the knight, but not the rook
      ]);

      expectMoves(game, { x: 4, y: 0 }, [{ x: 3, y: 0 }, { x: 3, y: 1 }, { x: 5, y: 0 }]);
      expectMoves(game, { x: 0, y: 3 }, []);
      expectMoves(game, { x: 1, y: 0 }, []);
    });
  });
});
