const BLACK = 'black'
const WHITE = 'white';

function compareFields(a, b) {
    if (typeof a.column == 'number') {
        return a.column - b.column || a.row - b.row;    
    } else {
        return a.column.localeCompare(b.column) || a.row - b.row;    
    }
}

// move to board?
// correct names are rank/file!
function Field(column, row) {
    this.column = column;
    this.row = parseInt(row);

    this.equals = function(field) {
        return this.column == field.column && this.row == field.row;
    }
}

// this is about fields not pieces
let columns = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h' ];

// this is about fields not pieces
// how to test?
function relativeToAbsolute(relativeField, origin) {
    let targetColumnIndex = columns.indexOf(origin.column) + relativeField.column;
    let targetRowIndex = origin.row + relativeField.row;
    if (targetColumnIndex < 0 || targetColumnIndex >= columns.length || targetRowIndex < 1 || targetRowIndex > 8) return null;

    return new Field(columns[ columns.indexOf(origin.column) + relativeField.column ], origin.row + relativeField.row);
}

// how to test?
// try to refactor out game?
function path(x, y, distance, game = null, origin = null, color = null) {
    let result = [];

    for (let i = 0; i < distance ; i++) {
        // refactor into something path like
        let step = new Field((i + 1) * x, (i + 1) * y);

        // refactor out
        if (collision(game, step, origin)) {
            let piece = collision(game, step, origin);

            // if other piece is different color, then allow capturing
            if (color && piece.color != color) {
                result.push(step);
            }
            break;
        }
        result.push(step);
    }

    return result;
}

// this is about fields not pieces
function collision(game, target, origin) {
    return (game && origin) ? game.getPieceAt(relativeToAbsolute(target, origin)) : false;
}

function straightMovesRelative(distance = 8) {
    let result = 
        path(1, 0, distance, this.game, this.field, this.color)
        .concat(path(-1, 0, distance, this.game, this.field, this.color))
        .concat(path(0, 1, distance, this.game, this.field, this.color))
        .concat(path(0, -1, distance, this.game, this.field, this.color))
        .sort(compareFields);
  
    return result;
}

function diagonalMovesRelative(distance = 8) {
    let result = 
        path(1, 1, distance, this.game, this.field, this.color)
        .concat(path(-1, 1, distance, this.game, this.field, this.color, this.color))
        .concat(path(1, -1, distance, this.game, this.field, this.color))
        .concat(path(-1, -1, distance, this.game, this.field, this.color))
        .sort(compareFields);
  
    return result;
}

function validMoves() {
    if (!this.field) return null;

    let relativeMoves = this.validMovesRelative();
    let field = this.field;

    return relativeMoves
        .map(e => relativeToAbsolute(e, field))
        .filter(e => e != null).sort(compareFields);;
}

function isValidMove(field) {
    return this.validMoves().find(m => m.equals(field))
}

// refactor into something context like
function decorateAbstractPiece(piece, color, field, game) {
    piece.color = color;
    piece.field = field;
    piece.game = game;
    piece.validMoves = validMoves;
    piece.isValidMove = isValidMove;
}

function Pawn(color, field, game, firstMove) {

    decorateAbstractPiece(this, color, field, game);
    
    this.firstMove = firstMove;

    this.getFace = function() {
        return (this.color == WHITE) ? '♙' : '♟︎';
    }

    this.validMovesRelative = function() {
        let distance = !this.firstMove ? 1 : 2;
        let direction = this.color == WHITE ? 1 : -1;
        let result = path(0, direction, distance, this.game, this.field);

        // pawns capture diagonal
        let pathLeft = new Field(-1, direction);
        let pieceLeft = collision(this.game, pathLeft, this.field);

        if (pieceLeft && pieceLeft.color !== this.color) {
            result.push(pathLeft);
        }

        // pawns capture diagonal
        let pathRight = new Field(1, direction);
        let pieceRight = collision(this.game, pathRight, this.field);

        if (pieceRight && pieceRight.color !== this.color) {
            result.push(pathRight);
        }

        return result;
    }
}

function Rook(color, field, game) {
    decorateAbstractPiece(this, color, field, game);

    this.getFace = function() {
        return (this.color == WHITE) ? '♖' : '♜';
    }
    
    this.validMovesRelative = straightMovesRelative;
}

function Knight(color, field, game) {
    decorateAbstractPiece(this, color, field, game);

    this.getFace = function() {
        return (this.color == WHITE) ? '♘' : '♞';
    }

    this.validMovesRelative = function() {
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
            let targetPiece = collision(this.game, s, this.field);
            return !(targetPiece && targetPiece.color == this.color);
        })
        .sort(compareFields);
    }
}

function Bishop(color, field, game) {
    decorateAbstractPiece(this, color, field, game);

    this.getFace = function() {
        return (this.color == WHITE) ? '♗' : '♝';
    }

    this.validMovesRelative = diagonalMovesRelative;
}

function Queen(color, field, game) {
    decorateAbstractPiece(this, color, field, game);
    
    this.getFace = function() {
        return (this.color == WHITE) ? '♕' : '♛';
    }

    this.validMovesRelativeStraight = straightMovesRelative;
    this.validMovesRelativeDiagonal = diagonalMovesRelative;
    
    this.validMovesRelative = function() {
        return this.validMovesRelativeStraight().concat(this.validMovesRelativeDiagonal()).sort(compareFields);;
    }
}

function King(color, field, game) {
    decorateAbstractPiece(this, color, field, game);

    this.getFace = function() {
        return (this.color == WHITE) ? '♔' : '♚';
    }

    this.validMovesRelativeStraight = straightMovesRelative;
    this.validMovesRelativeDiagonal = diagonalMovesRelative;
    
    this.validMovesRelative = function() {
        return this.validMovesRelativeStraight(1).concat(this.validMovesRelativeDiagonal(1)).sort(compareFields);;
    }
}

export { Field, Pawn, Rook, Knight, Bishop, Queen, King, BLACK, WHITE };