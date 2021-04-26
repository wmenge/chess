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
function relativeToAbsolute(relativeField, origin) {
    let targetColumnIndex = columns.indexOf(origin.column) + relativeField.column;
    let targetRowIndex = origin.row + relativeField.row;
    if (targetColumnIndex < 0 || targetColumnIndex >= columns.length || targetRowIndex < 1 || targetRowIndex > 8) return null;

    return new Field(columns[ columns.indexOf(origin.column) + relativeField.column ], origin.row + relativeField.row);
}

function straightMovesRelative(distance = 8) {
    let result = [];

    // travel east
    for (let i = 0; i < distance ; i++) {
        // refactor into something path like
        let target = new Field(i + 1, 0);
        if (this.game && this.field && this.game.getPieceAt(relativeToAbsolute(target, this.field))) {
            break;
        }
        result.push(target);
    }

    // travel west
    for (let i = 0; i < distance ; i++) {
        //result.push(new Field((i + 1) * -1, 0));
        // refactor into something path like so we can do collision detection later on
        let target = new Field((i + 1) * -1, 0);
        if (this.game && this.field && this.game.getPieceAt(relativeToAbsolute(target, this.field))) {
            break;
        }
        result.push(target);
    }

    // travel north
    for (let i = 0; i < distance ; i++) {
        //result.push(new Field(0, i + 1));
        // refactor into something path like
        let target = new Field(0, i + 1);
        if (this.game && this.field && this.game.getPieceAt(relativeToAbsolute(target, this.field))) {
            break;
        }
        result.push(target);
    }

    // travel south
    for (let i = 0; i < distance ; i++) {
        //result.push(new Field(0, (i + 1) * -1));
        // refactor into something path like
        let target = new Field(0, (i + 1) * -1);
        if (this.game && this.field && this.game.getPieceAt(relativeToAbsolute(target, this.field))) {
            break;
        }
        result.push(target);
    }
    
    return result.sort(compareFields);
}

function diagonalMovesRelative(distance = 8) {
    let result = [];

    // travel NE
    for (let i = 0; i < distance ; i++) {
        result.push(new Field(i + 1, i + 1));
    }

    // travel SE
    for (let i = 0; i < distance ; i++) {
        result.push(new Field((i + 1) * -1, i + 1));
    }

    // travel NW
    for (let i = 0; i < distance ; i++) {
        result.push(new Field((i + 1) * -1, (i + 1) * -1));
    }

    // travel SW
    for (let i = 0; i < distance ; i++) {
        result.push(new Field(i + 1, (i + 1) * -1));
    }

    return result.sort(compareFields);;
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

function Pawn(color, field, firstMove) {

    decorateAbstractPiece(this, color, field);
    
    this.firstMove = firstMove;

    this.getFace = function() {
        return (this.color == WHITE) ? '♙' : '♟︎';
    }

    this.validMovesRelative = function() {
        let distance = !this.firstMove ? 1 : 2;
        let direction = this.color == WHITE ? 1 : -1;
        let result = [];
        
        for (let i = 0; i < distance; i++) {
            result.push(new Field(0, (i + 1) * direction));
        }

        return result.sort(compareFields);
    }
}

function Rook(color, field, game) {
    decorateAbstractPiece(this, color, field, game);

    this.getFace = function() {
        return (this.color == WHITE) ? '♖' : '♜';
    }
    
    this.validMovesRelative = straightMovesRelative;
}

function Knight(color, field) {
    decorateAbstractPiece(this, color, field);

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
        ].sort(compareFields);
    }
}

function Bishop(color, field) {
    decorateAbstractPiece(this, color, field);

    this.getFace = function() {
        return (this.color == WHITE) ? '♗' : '♝';
    }

    this.validMovesRelative = diagonalMovesRelative;
}

function Queen(color, field) {
    decorateAbstractPiece(this, color, field);
    
    this.getFace = function() {
        return (this.color == WHITE) ? '♕' : '♛';
    }

    this.validMovesRelativeStraight = straightMovesRelative;
    this.validMovesRelativeDiagonal = diagonalMovesRelative;
    
    this.validMovesRelative = function() {
        return this.validMovesRelativeStraight().concat(this.validMovesRelativeDiagonal()).sort(compareFields);;
    }
}

function King(color, field) {
    decorateAbstractPiece(this, color, field);

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