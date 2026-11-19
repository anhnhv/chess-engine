import { expect } from "vitest";
import ChessGame, {
  Piece,
  Side,
  type CastlingState,
  type ChessMap,
  type Coordinate,
} from "../engine/chess";

/*
 * Conventions the tests assume. If your engine works differently, change
 * the helpers below and the tests will follow.
 *
 *  - A square is { x, y }, both numbers from 0 to 7.
 *  - x is the column, y is the row. White's pieces start on rows y = 0 and
 *    y = 1, black's on y = 6 and y = 7. Both kings start on column x = 4.
 *  - White pawns move towards y = 7 (y grows), black pawns towards y = 0.
 *  - getAvailableMoves returns legal destination squares, in any order and
 *    without duplicates. A move that would leave your own king in check is
 *    not legal.
 *  - There is no "side to move": any piece on the board can be asked for its
 *    moves.
 *  - A castling move is reported as the king's destination on its own row:
 *    x = 6 when castling with the rook on x = 7, x = 2 with the rook on x = 0.
 *  - allowCastling[side] = true lets that side castle with either rook, as
 *    long as the king and that rook are still on their starting squares.
 *  - En passant is not tested: the engine has no record of the previous move.
 *  - Comments write a square as (x, y).
 */

/** "w" or "b" for the side, then k, q, r, b, n or p for the piece. */
export type PieceCode = `${"w" | "b"}${"k" | "q" | "r" | "b" | "n" | "p"}`;

/** A piece on the board, e.g. { x: 4, y: 0, piece: "wk" } is the white king. */
export type PieceAt = Coordinate & { piece: PieceCode };

const PIECE_TYPES: Record<string, Piece> = {
  k: Piece.k,
  q: Piece.q,
  r: Piece.r,
  b: Piece.b,
  n: Piece.n,
  p: Piece.p,
};

function board(pieces: PieceAt[]): ChessMap {
  // The return type makes TypeScript reject a misspelt field name.
  return pieces.map(({ x, y, piece }): ChessMap[number] => ({
    coord: { x, y },
    side: piece[0] === "w" ? Side.w : Side.b,
    piece: PIECE_TYPES[piece[1]],
  }));
}

export function castling(white: boolean, black: boolean): CastlingState {
  return { [Side.w]: white, [Side.b]: black };
}

export const NO_CASTLING = castling(false, false);

export function setup(pieces: PieceAt[], allowCastling = NO_CASTLING): ChessGame {
  const game = new ChessGame();
  game.init(board(pieces), allowCastling);
  return game;
}

const byPosition = (a: Coordinate, b: Coordinate) => a.x - b.x || a.y - b.y;

/** Order-insensitive, but duplicates in the engine's result make it fail. */
export function expectMoves(
  game: ChessGame,
  from: Coordinate,
  expected: Coordinate[],
): void {
  const actual = game
    .getAvailableMoves(from)
    .map(({ x, y }) => ({ x, y }))
    .sort(byPosition);

  expect(actual, `moves from (${from.x}, ${from.y})`).toEqual(
    [...expected].sort(byPosition),
  );
}

/** Every square a knight on (3, 3) can reach. */
export const KNIGHT_IN_CENTRE_MOVES: Coordinate[] = [
  { x: 1, y: 2 }, { x: 1, y: 4 }, { x: 2, y: 1 }, { x: 2, y: 5 },
  { x: 4, y: 1 }, { x: 4, y: 5 }, { x: 5, y: 2 }, { x: 5, y: 4 },
];
