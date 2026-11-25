import { describe, it } from "vitest";
import { expectMoves, setup } from "../helpers";

// White pawns move towards y = 7 and black pawns towards y = 0, so every rule
// is tested for both colours. Each black test is its white twin flipped top to
// bottom: (x, y) becomes (x, 7 - y) and the colours swap.
//
// Within each colour the tests go from the simplest rule to the hardest: each
// test only needs the rules that the tests above it already need.
describe("getAvailableMoves", () => {
  describe("pawn", () => {
    describe("white (moves towards y = 7)", () => {
      it("advances one or two squares from its starting row", () => {
        const game = setup([
          { x: 4, y: 0, piece: "wk" }, { x: 4, y: 7, piece: "bk" },
          { x: 3, y: 1, piece: "wp" },
        ]);

        expectMoves(game, { x: 3, y: 1 }, [{ x: 3, y: 2 }, { x: 3, y: 3 }]);
      });

      it("advances only one square once it has left its starting row", () => {
        const game = setup([
          { x: 4, y: 0, piece: "wk" }, { x: 4, y: 7, piece: "bk" },
          { x: 3, y: 2, piece: "wp" },
        ]);

        expectMoves(game, { x: 3, y: 2 }, [{ x: 3, y: 3 }]);
      });

      it("cannot advance into or through an occupied square", () => {
        const game = setup([
          { x: 4, y: 0, piece: "wk" }, { x: 4, y: 7, piece: "bk" },
          // second square ahead is occupied
          { x: 4, y: 1, piece: "wp" }, { x: 4, y: 3, piece: "bn" },
          // own piece right in front
          { x: 2, y: 1, piece: "wp" }, { x: 2, y: 2, piece: "wn" },
          // enemy piece right in front
          { x: 6, y: 3, piece: "wp" }, { x: 6, y: 4, piece: "bp" },
        ]);

        expectMoves(game, { x: 4, y: 1 }, [{ x: 4, y: 2 }]);
        expectMoves(game, { x: 2, y: 1 }, []);
        expectMoves(game, { x: 6, y: 3 }, []);
      });

      it("captures enemy pieces diagonally forward", () => {
        const game = setup([
          { x: 4, y: 0, piece: "wk" }, { x: 4, y: 7, piece: "bk" },
          { x: 4, y: 3, piece: "wp" }, { x: 3, y: 4, piece: "bp" }, { x: 5, y: 4, piece: "bn" },
        ]);

        expectMoves(game, { x: 4, y: 3 }, [{ x: 4, y: 4 }, { x: 3, y: 4 }, { x: 5, y: 4 }]);
      });

      it("can still capture when it cannot advance", () => {
        const game = setup([
          { x: 4, y: 0, piece: "wk" }, { x: 4, y: 7, piece: "bk" },
          // blocked by an enemy piece
          { x: 4, y: 3, piece: "wp" }, { x: 4, y: 4, piece: "bp" }, { x: 3, y: 4, piece: "bn" },
          // blocked by an own piece
          { x: 6, y: 1, piece: "wp" }, { x: 6, y: 2, piece: "wb" }, { x: 7, y: 2, piece: "bp" },
        ]);

        expectMoves(game, { x: 4, y: 3 }, [{ x: 3, y: 4 }]);
        expectMoves(game, { x: 6, y: 1 }, [{ x: 7, y: 2 }]);
      });

      it("does not capture own pieces, sideways or backwards", () => {
        const game = setup([
          { x: 4, y: 0, piece: "wk" }, { x: 4, y: 7, piece: "bk" },
          { x: 4, y: 3, piece: "wp" },
          { x: 3, y: 4, piece: "wn" }, // own piece on a capture square
          { x: 5, y: 3, piece: "bn" }, // enemy piece beside the pawn
          { x: 3, y: 2, piece: "bp" }, // enemy piece diagonally behind the pawn
        ]);

        expectMoves(game, { x: 4, y: 3 }, [{ x: 4, y: 4 }]);
      });

      it("can advance or capture onto the last row", () => {
        const game = setup([
          { x: 4, y: 0, piece: "wk" }, { x: 4, y: 7, piece: "bk" },
          { x: 1, y: 6, piece: "wp" }, { x: 0, y: 7, piece: "br" },
        ]);

        expectMoves(game, { x: 1, y: 6 }, [{ x: 1, y: 7 }, { x: 0, y: 7 }]);
      });
    });

    describe("black (moves towards y = 0)", () => {
      it("advances one or two squares from its starting row", () => {
        const game = setup([
          { x: 4, y: 0, piece: "wk" }, { x: 4, y: 7, piece: "bk" },
          { x: 3, y: 6, piece: "bp" },
        ]);

        expectMoves(game, { x: 3, y: 6 }, [{ x: 3, y: 5 }, { x: 3, y: 4 }]);
      });

      it("advances only one square once it has left its starting row", () => {
        const game = setup([
          { x: 4, y: 0, piece: "wk" }, { x: 4, y: 7, piece: "bk" },
          { x: 3, y: 5, piece: "bp" },
        ]);

        expectMoves(game, { x: 3, y: 5 }, [{ x: 3, y: 4 }]);
      });

      it("cannot advance into or through an occupied square", () => {
        const game = setup([
          { x: 4, y: 0, piece: "wk" }, { x: 4, y: 7, piece: "bk" },
          // second square ahead is occupied
          { x: 4, y: 6, piece: "bp" }, { x: 4, y: 4, piece: "wn" },
          // own piece right in front
          { x: 2, y: 6, piece: "bp" }, { x: 2, y: 5, piece: "bn" },
          // enemy piece right in front
          { x: 6, y: 4, piece: "bp" }, { x: 6, y: 3, piece: "wp" },
        ]);

        expectMoves(game, { x: 4, y: 6 }, [{ x: 4, y: 5 }]);
        expectMoves(game, { x: 2, y: 6 }, []);
        expectMoves(game, { x: 6, y: 4 }, []);
      });

      it("captures enemy pieces diagonally forward", () => {
        const game = setup([
          { x: 4, y: 0, piece: "wk" }, { x: 4, y: 7, piece: "bk" },
          { x: 4, y: 4, piece: "bp" }, { x: 3, y: 3, piece: "wp" }, { x: 5, y: 3, piece: "wn" },
        ]);

        expectMoves(game, { x: 4, y: 4 }, [{ x: 4, y: 3 }, { x: 3, y: 3 }, { x: 5, y: 3 }]);
      });

      it("can still capture when it cannot advance", () => {
        const game = setup([
          { x: 4, y: 0, piece: "wk" }, { x: 4, y: 7, piece: "bk" },
          // blocked by an enemy piece
          { x: 4, y: 4, piece: "bp" }, { x: 4, y: 3, piece: "wp" }, { x: 3, y: 3, piece: "wn" },
          // blocked by an own piece
          { x: 6, y: 6, piece: "bp" }, { x: 6, y: 5, piece: "bb" }, { x: 7, y: 5, piece: "wp" },
        ]);

        expectMoves(game, { x: 4, y: 4 }, [{ x: 3, y: 3 }]);
        expectMoves(game, { x: 6, y: 6 }, [{ x: 7, y: 5 }]);
      });

      it("does not capture own pieces, sideways or backwards", () => {
        const game = setup([
          { x: 4, y: 0, piece: "wk" }, { x: 4, y: 7, piece: "bk" },
          { x: 4, y: 4, piece: "bp" },
          { x: 3, y: 3, piece: "bn" }, // own piece on a capture square
          { x: 5, y: 4, piece: "wn" }, // enemy piece beside the pawn
          { x: 3, y: 5, piece: "wp" }, // enemy piece diagonally behind the pawn
        ]);

        expectMoves(game, { x: 4, y: 4 }, [{ x: 4, y: 3 }]);
      });

      it("can advance or capture onto the last row", () => {
        const game = setup([
          { x: 4, y: 0, piece: "wk" }, { x: 4, y: 7, piece: "bk" },
          { x: 1, y: 1, piece: "bp" }, { x: 0, y: 0, piece: "wr" },
        ]);

        expectMoves(game, { x: 1, y: 1 }, [{ x: 1, y: 0 }, { x: 0, y: 0 }]);
      });
    });

    it("only captures the pinning piece when pinned on a diagonal", () => {
      const game = setup([
        { x: 4, y: 0, piece: "wk" }, { x: 7, y: 7, piece: "bk" },
        // The bishop on (6, 2) pins the pawn on (5, 1). Pushing the pawn or
        // capturing the knight on (4, 2) would leave the king in check.
        { x: 5, y: 1, piece: "wp" }, { x: 6, y: 2, piece: "bb" },
        { x: 4, y: 2, piece: "bn" },
      ]);

      expectMoves(game, { x: 5, y: 1 }, [{ x: 6, y: 2 }]);
    });
  });
});
