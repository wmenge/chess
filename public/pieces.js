const BLACK = 'black'
const WHITE = 'white';

function compareFields(a, b) {
    if (typeof a.column == 'number') {
        return a.column - b.column || a.row - b.row;    
    } else {
        return a.column.localeCompare(b.column) || a.row - b.row;    
    }
}

// move to pathfinding.js?
// correct names are rank/file!
// create shorthands: a1 = new Field("a", 1)
// never create fields manually, because we cannot
// overload == in javascript atm. Always use predefined fields
// make distinction between relative, absolute fields!
function Field(column, row) {
    this.column = column;
    this.row = parseInt(row);

    this.equals = function(field) {
        return this.column == field.column && this.row == field.row;
    }
}

// this is about fields not pieces
let columns = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h' ];

function PredefineFields() {
    columns.forEach(c => {
        for (let i = 0; i < 8 ; i++) {
            this[`${c}${i+1}`] = (new Field(c, i+1));
        }
    });

    this.getField = function(column, row) {
        return this[`${column}${row}`]
    };

}

let fields = new PredefineFields();

// this is about fields not pieces
// how to test?
function relativeToAbsolute(relativeField, origin) {
    let targetColumnIndex = columns.indexOf(origin.column) + relativeField.column;
    let targetRowIndex = origin.row + relativeField.row;
    if (targetColumnIndex < 0 || targetColumnIndex >= columns.length || targetRowIndex < 1 || targetRowIndex > 8) return null;

    return fields[`${columns[targetColumnIndex]}${targetRowIndex}`];
}

// try to remove piece from constructor, most places where you
// pass the context from the game, you pass it to the piece
function PathContext(origin = null, piece = null, game = null) {
    this.origin = origin;
    this.piece = piece;
    this.game = game;
}

// how to test?
// try to refactor out game?
// do context, should be atomic: either game + piece or nothing
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

// this is about fields not pieces
// move to game?
// refactor out relative to absolute (provide absolute to begin with)
function collision(game, target, origin) {
    return (game && origin) ? game.getPieceAt(relativeToAbsolute(target, origin)) : false;
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

function decorateAbstractPiece(piece, color) {
    piece.color = color;
    piece.validMoves = validMoves;
    piece.isValidMove = isValidMove;
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
        //.filter(s => {
        //    let targetPiece = collision(this.game, s, this.field);
        //    return !(targetPiece && targetPiece.color == this.color);
        //})
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

export { fields, Field, PathContext, Pawn, Rook, Knight, Bishop, Queen, King, BLACK, WHITE };