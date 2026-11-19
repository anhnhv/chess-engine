export enum Side {
  w,
  b,
}

export enum Piece {
  k,
  q,
  r,
  b,
  n,
  p,
}

type Position = {
  coord: Coordinate;
  piece?: Piece;
  side?: Side;
};

export type Coordinate = {
  x: number;
  y: number;
};

export type CastlingState = Record<Side, boolean>;

export type ChessMap = Position[];

class ChessGame {
  private allowCastling: CastlingState;
  private board: ChessMap;

  constructor() {
    this.allowCastling = {
      [Side.w]: false,
      [Side.b]: false,
    };
    this.board = [];
  }

  init(positions: ChessMap, allowCastling: CastlingState) {
    this.board = positions;
    this.allowCastling = allowCastling;
  }

  getAvailableMoves(coord: Coordinate): Coordinate[] {
    const position = this.getPosition(coord);

    if (position.piece === Piece.p) {
      return this.calcualtePawnSteps(position);
    }

    return [];
  }

  private getPosition(coord: Coordinate): Position {
    const pos = this.board.find(
      (position) =>
        position.coord.x === coord.x && position.coord.y === coord.y,
    );
    return pos as Position;
  }

  private stepsToCoords(from: Coordinate, steps: number[][]): Coordinate[] {
    const coords = steps.map((step) => ({
      x: from.x + step[0],
      y: from.y + step[1],
    }));

    return coords;
  }

  private calcualtePawnSteps(position: Position) {
    let steps: number[][] = [];
    const { x, y } = position.coord;
    if (position.side === Side.w) {
      steps = [[0, 1]];

      if (position.coord.y === 1) {
        steps.push([0, 2]);
      }

      const pos1 = this.getPosition({ x: x - 1, y: y + 1 });
      if (pos1.side === Side.b) {
        steps.push([-1, 1]);
      }
    } else if (position.side === Side.b) {
      steps = [[0, -1]];

      if (position.coord.y === 6) {
        steps.push([0, -2]);
      }
    }

    return steps.length
      ? this.stepsToCoords(position.coord, steps)
      : [{ x: -1, y: -1 }];
  }
}

export default ChessGame;
