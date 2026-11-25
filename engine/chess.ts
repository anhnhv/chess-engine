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

  private static isValidCoord(coord: Coordinate) {
    return coord.x >= 0 && coord.x <= 7 && coord.y >= 0 && coord.y <= 7;
  }

  private static getPosition(
    coord: Coordinate,
    board: Position[],
  ): Position | undefined {
    if (!ChessGame.isValidCoord(coord)) {
      return;
    }

    const pos = board.find(
      (position) =>
        position.coord.x === coord.x && position.coord.y === coord.y,
    );

    return (
      pos ?? {
        coord: { ...coord },
      }
    );
  }

  private removeInvalidPositions(coords: Coordinate[]) {
    const validPositions = coords.filter((coord) => {
      return coord.x >= 0 && coord.x <= 7 && coord.y >= 0 && coord.y <= 7;
    });

    return validPositions;
  }

  static findNearestPiece(board: ChessMap, fromPos: Position, step: number[]) {
    let currCoord = {
      x: fromPos.coord.x,
      y: fromPos.coord.y,
    };

    do {
      currCoord.x = currCoord.x + step[0];
      currCoord.y = currCoord.y + step[1];

      const currPos = ChessGame.getPosition(currCoord, board);
      if (currPos?.piece !== undefined) {
        return currPos;
      }

      if (!ChessGame.isValidCoord(currCoord)) {
        return;
      }
    } while (1);
  }

  private isKingAttacked(assumBoard: ChessMap, side: Side) {
    const kingPos = assumBoard.find(
      (pos) => pos.side === side && pos.piece === Piece.k,
    );
    if (!kingPos) {
      return false;
    }

    const stepRules = [
      // Straight lines:
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
      // Diagonals:
      [-1, -1],
      [1, 1],
      [1, -1],
      [-1, 1],
    ];

    for (const stepRule of stepRules) {
      const nearestPiece = ChessGame.findNearestPiece(
        assumBoard,
        kingPos,
        stepRule,
      );
      if (!nearestPiece || nearestPiece.side === side) {
        continue;
      }

      let rawSteps: Coordinate[] = [];
      if (nearestPiece?.piece === Piece.p) {
        rawSteps = this.calcualtePawnSteps(nearestPiece, assumBoard);
      } else if (nearestPiece?.piece === Piece.r) {
        rawSteps = this.calcualteRookSteps(nearestPiece, assumBoard);
      } else if (nearestPiece?.piece === Piece.k) {
        rawSteps = this.calcualteKingSteps(nearestPiece, assumBoard);
      } else if (nearestPiece?.piece === Piece.b) {
        rawSteps = this.calcualteBishopSteps(nearestPiece, assumBoard);
      } else if (nearestPiece?.piece === Piece.q) {
        rawSteps = this.calcualteBishopSteps(nearestPiece, assumBoard).concat(
          this.calcualteRookSteps(nearestPiece, assumBoard),
        );
      }

      rawSteps = this.removeInvalidPositions(rawSteps);

      const foundChecked = rawSteps.find((step) => {
        if (step.x === kingPos.coord.x && step.y === kingPos.coord.y) {
          return true;
        }
      });

      if (foundChecked) {
        return true;
      }
    }

    // Knights jump in an L-shape, so they are never on the rays scanned above:
    // check the 8 squares a knight could attack the king from.
    const knightOffsets = [
      [1, 2],
      [2, 1],
      [2, -1],
      [1, -2],
      [-1, -2],
      [-2, -1],
      [-2, 1],
      [-1, 2],
    ];

    for (const [dx, dy] of knightOffsets) {
      const pos = ChessGame.getPosition(
        { x: kingPos.coord.x + dx, y: kingPos.coord.y + dy },
        assumBoard,
      );
      if (pos?.piece === Piece.n && pos.side !== side) {
        return true;
      }
    }

    return false;
  }

  private isOccupied(fromPos: Position, toPos: Position) {
    if (fromPos.side === toPos.side && fromPos.side) {
      return true;
    }

    const fromCoord = fromPos.coord;
    const toCoord = toPos.coord;

    let step: number[] = [0, 0];
    if (fromCoord.y === toCoord.y) {
      step = [toCoord.x - fromCoord.x > 0 ? 1 : -1, 0];
    } else if (fromCoord.x === toCoord.x) {
      step = [0, toCoord.y - fromCoord.y > 0 ? 1 : -1];
    } else if (toCoord.x - fromCoord.x === toCoord.y - fromCoord.y) {
      step = [
        toCoord.x - fromCoord.x > 0 ? 1 : -1,
        toCoord.y - fromCoord.y > 0 ? 1 : -1,
      ];
    }

    if (step[0] === 0 && step[1] === 0) {
      return true;
    }

    const currCoord = {
      x: fromCoord.x + step[0],
      y: fromCoord.y + step[1],
    };
    let currPos = this.getPosition(currCoord);

    while (
      currPos?.coord.x !== toPos.coord.x &&
      currPos?.coord.y !== toPos.coord.y
    ) {
      if (currPos?.side) {
        return true;
      }

      if (currPos) {
        currPos = this.getPosition({
          x: currPos?.coord?.x + step[0],
          y: currPos?.coord?.y + step[1],
        });
      }
    }

    return false;
  }

  private getAssumedBoard(fromPos: Position, toPos: Position) {
    const currentBoard: Position[] = JSON.parse(JSON.stringify(this.board));
    const tempPos: Position = JSON.parse(JSON.stringify(fromPos));
    tempPos.coord.x = toPos.coord.x;
    tempPos.coord.y = toPos.coord.y;

    for (let i = currentBoard.length - 1; i >= 0; i--) {
      const currentPos = currentBoard[i];

      if (!currentPos) {
        continue;
      }
      if (
        currentPos.coord.x === fromPos.coord.x &&
        currentPos.coord.y === fromPos.coord.y
      ) {
        currentBoard.splice(i, 1);
      } else if (
        currentPos.coord.x === toPos.coord.x &&
        currentPos.coord.y === toPos.coord.y
      ) {
        currentBoard.splice(i, 1);
      }
    }

    currentBoard.push(tempPos);

    return currentBoard;
  }

  getAvailableMoves(coord: Coordinate): Coordinate[] {
    try {
      const currPos = this.getPosition(coord);
      if (!currPos || currPos?.side === undefined) {
        return [];
      }

      let rawSteps: Coordinate[] = [];
      if (currPos?.piece === Piece.p) {
        rawSteps = this.calcualtePawnSteps(currPos);
      } else if (currPos?.piece === Piece.r) {
        rawSteps = this.calcualteRookSteps(currPos);
      } else if (currPos?.piece === Piece.b) {
        rawSteps = this.calcualteBishopSteps(currPos);
      } else if (currPos?.piece === Piece.q) {
        rawSteps = this.calcualteBishopSteps(currPos).concat(
          this.calcualteRookSteps(currPos),
        );
      } else if (currPos?.piece === Piece.n) {
        rawSteps = this.calcualteKnightSteps(currPos);
      } else if (currPos?.piece === Piece.k) {
        rawSteps = this.calcualteKingSteps(currPos);
      }

      let validPositions = this.removeInvalidPositions(rawSteps);

      validPositions = validPositions.filter((pos) => {
        const assumPos = this.getPosition(pos);
        if (!assumPos) {
          return false;
        }

        const assumeBoard = this.getAssumedBoard(currPos, assumPos);
        if (this.isKingAttacked(assumeBoard, currPos.side as Side)) {
          return false;
        }

        return true;
      });

      return validPositions;
    } catch (error) {
      console.log("error", error);
      return [];
    }
  }

  private getPosition(
    coord: Coordinate,
    board?: Position[],
  ): Position | undefined {
    if (coord.x < 0 || coord.x > 7 || coord.y < 0 || coord.y > 7) {
      return;
    }

    const pos = (board ?? this.board).find(
      (position) =>
        position.coord.x === coord.x && position.coord.y === coord.y,
    );

    return (
      pos ?? {
        coord: { ...coord },
      }
    );
  }

  private stepsToCoords(
    fromPos: Position,
    stepRules: number[][],
    maxStep = 0,
    board?: Position[],
  ): Coordinate[] {
    const validCoords = [];
    for (const currStepRule of stepRules) {
      let currCoord = { ...fromPos.coord };
      let currPos = this.getPosition(currCoord, board);
      let stepCount = 0;

      do {
        currCoord = {
          x: currCoord.x + currStepRule[0],
          y: currCoord.y + currStepRule[1],
        };
        currPos = this.getPosition(currCoord, board);

        if (currPos) {
          const isOccupied = currPos.side !== undefined;

          if (isOccupied) {
            const isSameSide = currPos.side === fromPos.side;

            if (!isSameSide) {
              validCoords.push(currPos.coord);
              stepCount++;
            }

            break;
          }

          validCoords.push(currPos.coord);
          stepCount++;
        }
      } while (currPos && (!maxStep || stepCount < maxStep));
    }

    return validCoords;
  }

  private calcualteKnightSteps(position: Position, board?: ChessMap) {
    const stepRules = [
      [-1, 2],
      [-1, -2],
      [1, 2],
      [1, -2],
      [2, 1],
      [2, -1],
      [-2, 1],
      [-2, -1],
    ];
    return this.stepsToCoords(position, stepRules, 1, board);
  }

  private calcualteBishopSteps(position: Position, board?: ChessMap) {
    const stepRules = [
      [-1, 1],
      [1, 1],
      [1, -1],
      [-1, -1],
    ];
    return this.stepsToCoords(position, stepRules, 0, board);
  }

  private calcualteKingSteps(position: Position, board?: ChessMap) {
    const stepRules = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
      [-1, 1],
      [1, 1],
      [1, -1],
      [-1, -1],
    ];
    return this.stepsToCoords(position, stepRules, 1, board);
  }

  private calcualteRookSteps(position: Position, board?: ChessMap) {
    const stepRules = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];
    return this.stepsToCoords(position, stepRules, 0, board);
  }

  private calcualtePawnSteps(position: Position, board?: ChessMap) {
    const coords: Coordinate[] = [];
    const { x, y } = position.coord;

    if (position.side === Side.w) {
      const front1Pos = this.getPosition(
        {
          ...position.coord,
          y: position.coord.y + 1,
        },
        board,
      );
      const front2Pos = this.getPosition(
        {
          ...position.coord,
          y: position.coord.y + 2,
        },
        board,
      );

      if (front1Pos?.coord && front1Pos.piece === undefined) {
        coords.push(front1Pos.coord);

        if (position.coord.y === 1 && front2Pos?.coord && !front2Pos.piece) {
          coords.push(front2Pos.coord);
        }
      }

      const leftPos = this.getPosition({ x: x - 1, y: y + 1 }, board);
      const rightPos = this.getPosition({ x: x + 1, y: y + 1 }, board);

      if (leftPos?.side === Side.b) {
        coords.push(leftPos.coord);
      }

      if (rightPos?.side === Side.b) {
        coords.push(rightPos.coord);
      }
    } else if (position.side === Side.b) {
      const front1Pos = this.getPosition(
        {
          ...position.coord,
          y: position.coord.y - 1,
        },
        board,
      );
      const front2Pos = this.getPosition(
        {
          ...position.coord,
          y: position.coord.y - 2,
        },
        board,
      );

      if (front1Pos?.coord && front1Pos.piece === undefined) {
        coords.push(front1Pos.coord);

        if (position.coord.y === 6 && front2Pos?.coord && !front2Pos.piece) {
          coords.push(front2Pos.coord);
        }
      }

      const leftPos = this.getPosition({ x: x - 1, y: y - 1 }, board);
      const rightPos = this.getPosition({ x: x + 1, y: y - 1 }, board);

      if (leftPos?.side === Side.w) {
        coords.push(leftPos.coord);
      }

      if (rightPos?.side === Side.w) {
        coords.push(rightPos.coord);
      }
    }

    return coords;
  }
}

export default ChessGame;
