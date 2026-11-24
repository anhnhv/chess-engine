import { describe, it } from "vitest";
import { expectMoves, setup } from "../helpers";

describe("getAvailableMoves", () => {
  describe("king", () => {
    // it("moves one square in every direction", () => {
    //   const game = setup([
    //     { x: 3, y: 3, piece: "wk" }, { x: 7, y: 7, piece: "bk" },
    //   ]);

    //   expectMoves(game, { x: 3, y: 3 }, [
    //     { x: 2, y: 2 }, { x: 2, y: 3 }, { x: 2, y: 4 }, { x: 3, y: 2 },
    //     { x: 3, y: 4 }, { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 },
    //   ]);
    // });

    // it("captures enemy pieces but not own pieces", () => {
    //   const game = setup([
    //     { x: 3, y: 3, piece: "wk" }, { x: 7, y: 7, piece: "bk" },
    //     { x: 3, y: 4, piece: "wp" }, // own
    //     { x: 3, y: 2, piece: "bp" }, // enemy
    //   ]);

    //   expectMoves(game, { x: 3, y: 3 }, [
    //     { x: 2, y: 2 }, { x: 2, y: 3 }, { x: 2, y: 4 }, { x: 3, y: 2 },
    //     { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 },
    //   ]);
    // });

    // it("does not move onto squares attacked by the enemy", () => {
    //   const game = setup([
    //     { x: 3, y: 3, piece: "wk" }, { x: 7, y: 7, piece: "bk" },
    //     { x: 0, y: 4, piece: "br" }, // attacks the whole row y = 4
    //   ]);

    //   expectMoves(game, { x: 3, y: 3 }, [
    //     { x: 2, y: 2 }, { x: 2, y: 3 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 4, y: 3 },
    //   ]);
    // });

    it("does not move next to the enemy king", () => {
      const game = setup([
        { x: 3, y: 3, piece: "wk" }, { x: 3, y: 5, piece: "bk" },
      ]);

      expectMoves(game, { x: 3, y: 3 }, [
        { x: 2, y: 2 }, { x: 2, y: 3 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 4, y: 3 },
      ]);
      // expectMoves(game, { x: 3, y: 5 }, [
      //   { x: 2, y: 5 }, { x: 2, y: 6 }, { x: 3, y: 6 }, { x: 4, y: 5 }, { x: 4, y: 6 },
      // ]);
    });

    // it("does not capture a defended piece", () => {
    //   // The bishop on (5, 0) defends the pawn on (3, 2).
    //   const game = setup([
    //     { x: 3, y: 3, piece: "wk" }, { x: 7, y: 7, piece: "bk" },
    //     { x: 3, y: 2, piece: "bp" }, { x: 5, y: 0, piece: "bb" },
    //   ]);

    //   expectMoves(game, { x: 3, y: 3 }, [
    //     { x: 2, y: 2 }, { x: 2, y: 3 }, { x: 2, y: 4 }, { x: 3, y: 4 },
    //     { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 },
    //   ]);
    // });

    // it("may step in front of an enemy pawn, which only attacks diagonally", () => {
    //   const game = setup([
    //     { x: 3, y: 3, piece: "wk" }, { x: 7, y: 7, piece: "bk" },
    //     { x: 3, y: 5, piece: "bp" }, // attacks (2, 4) and (4, 4), not (3, 4)
    //   ]);

    //   expectMoves(game, { x: 3, y: 3 }, [
    //     { x: 2, y: 2 }, { x: 2, y: 3 }, { x: 3, y: 2 },
    //     { x: 3, y: 4 }, { x: 4, y: 2 }, { x: 4, y: 3 },
    //   ]);
    // });
  });
});
