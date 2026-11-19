import { describe, it } from "vitest";
import { castling, expectMoves, setup, type PieceAt } from "../helpers";

describe("getAvailableMoves", () => {
  describe("castling", () => {
    // White king and both white rooks on their starting squares.
    const WHITE_CASTLING_SETUP: PieceAt[] = [
      { x: 4, y: 0, piece: "wk" }, { x: 0, y: 0, piece: "wr" }, { x: 7, y: 0, piece: "wr" },
    ];

    it("lets the king castle on both sides when allowed and the path is clear", () => {
      const game = setup(
        [...WHITE_CASTLING_SETUP, { x: 4, y: 7, piece: "bk" }],
        castling(true, false),
      );

      expectMoves(game, { x: 4, y: 0 }, [
        { x: 2, y: 0 }, { x: 6, y: 0 }, // castling
        { x: 3, y: 0 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 0 }, { x: 5, y: 1 },
      ]);
    });

    it("reads allowCastling separately for each side", () => {
      const pieces: PieceAt[] = [
        ...WHITE_CASTLING_SETUP,
        { x: 4, y: 7, piece: "bk" }, { x: 0, y: 7, piece: "br" }, { x: 7, y: 7, piece: "br" },
      ];

      const blackOnly = setup(pieces, castling(false, true));
      expectMoves(blackOnly, { x: 4, y: 0 }, [
        { x: 3, y: 0 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 0 }, { x: 5, y: 1 },
      ]);
      expectMoves(blackOnly, { x: 4, y: 7 }, [
        { x: 2, y: 7 }, { x: 6, y: 7 }, // castling
        { x: 3, y: 6 }, { x: 3, y: 7 }, { x: 4, y: 6 }, { x: 5, y: 6 }, { x: 5, y: 7 },
      ]);

      const whiteOnly = setup(pieces, castling(true, false));
      expectMoves(whiteOnly, { x: 4, y: 0 }, [
        { x: 2, y: 0 }, { x: 6, y: 0 }, // castling
        { x: 3, y: 0 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 0 }, { x: 5, y: 1 },
      ]);
      expectMoves(whiteOnly, { x: 4, y: 7 }, [
        { x: 3, y: 6 }, { x: 3, y: 7 }, { x: 4, y: 6 }, { x: 5, y: 6 }, { x: 5, y: 7 },
      ]);
    });

    it("does not castle when a square between the king and rook is occupied", () => {
      const queenside = setup(
        [...WHITE_CASTLING_SETUP, { x: 4, y: 7, piece: "bk" }, { x: 1, y: 0, piece: "wn" }],
        castling(true, false),
      );
      expectMoves(queenside, { x: 4, y: 0 }, [
        { x: 6, y: 0 }, // castling
        { x: 3, y: 0 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 0 }, { x: 5, y: 1 },
      ]);

      const kingside = setup(
        [...WHITE_CASTLING_SETUP, { x: 4, y: 7, piece: "bk" }, { x: 6, y: 0, piece: "wn" }],
        castling(true, false),
      );
      expectMoves(kingside, { x: 4, y: 0 }, [
        { x: 2, y: 0 }, // castling
        { x: 3, y: 0 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 0 }, { x: 5, y: 1 },
      ]);
    });

    it("does not castle without a rook on the corner square", () => {
      const game = setup(
        [{ x: 4, y: 0, piece: "wk" }, { x: 7, y: 0, piece: "wr" }, { x: 4, y: 7, piece: "bk" }],
        castling(true, false),
      );

      expectMoves(game, { x: 4, y: 0 }, [
        { x: 6, y: 0 }, // castling, with the rook on (7, 0) only
        { x: 3, y: 0 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 0 }, { x: 5, y: 1 },
      ]);
    });

    it("does not castle when the king is not on its starting square", () => {
      const game = setup(
        [
          { x: 3, y: 0, piece: "wk" }, { x: 0, y: 0, piece: "wr" }, { x: 7, y: 0, piece: "wr" },
          { x: 4, y: 7, piece: "bk" },
        ],
        castling(true, false),
      );

      expectMoves(game, { x: 3, y: 0 }, [
        { x: 2, y: 0 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 0 }, { x: 4, y: 1 },
      ]);
    });

    it("does not castle out of check", () => {
      const game = setup(
        [...WHITE_CASTLING_SETUP, { x: 2, y: 7, piece: "bk" }, { x: 4, y: 7, piece: "br" }],
        castling(true, false),
      );

      expectMoves(game, { x: 4, y: 0 }, [
        { x: 3, y: 0 }, { x: 3, y: 1 }, { x: 5, y: 0 }, { x: 5, y: 1 },
      ]);
    });

    it("does not castle through an attacked square", () => {
      // The rook on (5, 7) attacks (5, 0), which the king crosses to reach (6, 0).
      const kingside = setup(
        [...WHITE_CASTLING_SETUP, { x: 2, y: 7, piece: "bk" }, { x: 5, y: 7, piece: "br" }],
        castling(true, false),
      );
      expectMoves(kingside, { x: 4, y: 0 }, [
        { x: 2, y: 0 }, // castling
        { x: 3, y: 0 }, { x: 3, y: 1 }, { x: 4, y: 1 },
      ]);

      // The rook on (3, 7) attacks (3, 0), which the king crosses to reach (2, 0).
      const queenside = setup(
        [...WHITE_CASTLING_SETUP, { x: 2, y: 7, piece: "bk" }, { x: 3, y: 7, piece: "br" }],
        castling(true, false),
      );
      expectMoves(queenside, { x: 4, y: 0 }, [
        { x: 6, y: 0 }, // castling
        { x: 4, y: 1 }, { x: 5, y: 0 }, { x: 5, y: 1 },
      ]);
    });

    it("does not castle into check", () => {
      // The rook on (6, 7) attacks (6, 0), where the king would land.
      const kingside = setup(
        [...WHITE_CASTLING_SETUP, { x: 2, y: 7, piece: "bk" }, { x: 6, y: 7, piece: "br" }],
        castling(true, false),
      );
      expectMoves(kingside, { x: 4, y: 0 }, [
        { x: 2, y: 0 }, // castling
        { x: 3, y: 0 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 0 }, { x: 5, y: 1 },
      ]);

      // The rook on (2, 7) attacks (2, 0), where the king would land.
      const queenside = setup(
        [...WHITE_CASTLING_SETUP, { x: 1, y: 7, piece: "bk" }, { x: 2, y: 7, piece: "br" }],
        castling(true, false),
      );
      expectMoves(queenside, { x: 4, y: 0 }, [
        { x: 6, y: 0 }, // castling
        { x: 3, y: 0 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 0 }, { x: 5, y: 1 },
      ]);
    });

    it("still castles queenside when only the square next to the rook is attacked", () => {
      // The rook on (1, 7) attacks (1, 0), but the king never crosses (1, 0).
      const game = setup(
        [...WHITE_CASTLING_SETUP, { x: 2, y: 7, piece: "bk" }, { x: 1, y: 7, piece: "br" }],
        castling(true, false),
      );

      expectMoves(game, { x: 4, y: 0 }, [
        { x: 2, y: 0 }, { x: 6, y: 0 }, // castling
        { x: 3, y: 0 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 0 }, { x: 5, y: 1 },
      ]);
    });
  });
});
