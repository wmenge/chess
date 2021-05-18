import { Field, compareFields, collision, relativeToAbsolute } from '/fields.js';

const BLACK = 'black'
const WHITE = 'white';

// try to remove piece from constructor, most places where you
// pass the context from the game, you pass it to the piece
function MoveContext(origin = null, piece = null, game = null) {
    this.origin = origin;
    this.piece = piece;
    this.game = game;
}

function decorateAbstractPiece(piece, color) {
    piece.color = color;
    piece.validMoves = validMoves;
    piece.isValidMove = isValidMove;
}

function path(x, y, distance, context = null, capture = true) {
    let result = [];

    for (let i = 0; i < distance ; i++) {
        // refactor into something path like
        let step = new Field((i + 1) * x, (i + 1) * y);

        // refactor out
        if (context && collision(context.game, step, context.origin)) {
            let occupyingPiece = collision(context.game, step, context.origin);

            // if other piece is different color, then allow capturing
            if (context && capture && occupyingPiece.color != context.piece.color) {
                result.push(step);
            }
            break;
        }
        result.push(step);
    }

    return result;
}

function straightMovesRelative(context = null, distance = 8) {
    let result = 
        path(1, 0, distance, context)
        .concat(path(-1, 0, distance, context))
        .concat(path(0, 1, distance, context))
        .concat(path(0, -1, distance, context))
        .sort(compareFields);
  
    return result;
}

function diagonalMovesRelative(context = null, distance = 8) {
    let result = 
        path(1, 1, distance, context)
        .concat(path(-1, 1, distance, context))
        .concat(path(1, -1, distance, context))
        .concat(path(-1, -1, distance, context))
        .sort(compareFields);
  
    return result;
}

function validMoves(context) {
    let relativeMoves = this.validMovesRelative(context);
    
    return relativeMoves
        .map(e => relativeToAbsolute(e, context.origin))
        .filter(e => e != null).sort(compareFields);;
}

function isValidMove(context, target) {
    return this.validMoves(context).find(m => m.equals(target))
}

function Pawn(color) {

    decorateAbstractPiece(this, color);

    this.getFace = function() {
        return (this.color == WHITE) ? '♙' : '♟︎';
    }

    this.validMovesRelative = function(context = null) {
        let distance = 1//!this.firstMove ? 1 : 2;
        let direction = this.color == WHITE ? 1 : -1;
        
        // On first move, pawn can move to spaces
        if (context && context.origin) {
            distance = this.isInitialPosition(context.origin) ? 2 : 1;
        }

        let result = path(0, direction, distance, context, false);

        if (context) {
            // pawns capture diagonal
            let pathLeft = new Field(-1, direction);
            let pieceLeft = collision(context.game, pathLeft, context.origin);

            if (pieceLeft && pieceLeft.color !== this.color) {
                result.push(pathLeft);
            }

            // pawns capture diagonal
            let pathRight = new Field(1, direction);
            let pieceRight = collision(context.game, pathRight, context.origin);

            if (pieceRight && pieceRight.color !== this.color) {
                result.push(pathRight);
            }
        }

        return result;
    }

    this.isInitialPosition = function(origin) {
        return (this.color == WHITE && origin.row == 2) || (this.color == BLACK && origin.row == 7);
    }
}

function Rook(color) {
    decorateAbstractPiece(this, color);

    this.getFace = function() {
        return (this.color == WHITE) ? '♖' : '♜';
    }
    
    this.validMovesRelative = straightMovesRelative;
}

function Knight(color) {
    decorateAbstractPiece(this, color);

    this.getFace = function() {
        return (this.color == WHITE) ? '♘' : '♞';
    }

    this.validMovesRelative = function(context = null) {
        return [
            new Field(2, 1),
            new Field(1, 2),
            new Field(2, -1),
            new Field(-1, 2),
            new Field(-2, 1),
            new Field(1, -2),
            new Field(-2, -1),
            new Field(-1, -2)
        ]
        // do not allow jumps to fields w/ pieces of own color
        .filter(s => {
            let targetPiece = context == null ? null : collision(context.game, s, context.origin);
            return !(targetPiece && targetPiece.color == this.color);
        })
        .sort(compareFields);
    }
}

function Bishop(color) {
    decorateAbstractPiece(this, color);

    this.getFace = function() {
        return (this.color == WHITE) ? '♗' : '♝';
    }

    this.validMovesRelative = diagonalMovesRelative;
}

function Queen(color) {
    decorateAbstractPiece(this, color);
    
    this.getFace = function() {
        return (this.color == WHITE) ? '♕' : '♛';
    }

    this.validMovesRelativeStraight = straightMovesRelative;
    this.validMovesRelativeDiagonal = diagonalMovesRelative;
    
    this.validMovesRelative = function(context = null) {
        return this.validMovesRelativeStraight(context).concat(this.validMovesRelativeDiagonal(context)).sort(compareFields);;
    }
}

function King(color) {
    decorateAbstractPiece(this, color);

    this.getFace = function() {
        return (this.color == WHITE) ? '♔' : '♚';
    }

    this.validMovesRelativeStraight = straightMovesRelative;
    this.validMovesRelativeDiagonal = diagonalMovesRelative;
    
    this.validMovesRelative = function(context = null) {
        return this.validMovesRelativeStraight(context, 1).concat(this.validMovesRelativeDiagonal(context, 1)).sort(compareFields);
    }
}

export { Pawn, Rook, Knight, Bishop, Queen, King, BLACK, WHITE, MoveContext };