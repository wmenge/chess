import { fields, Field, compareFields, collision, relativeToAbsolute } from '/fields.js';
import { MoveContext, Move } from '/move.js';

const BLACK = 'black'
const WHITE = 'white';

// try to remove piece from constructor, most places where you
// pass the context from the game, you pass it to the piece
/*function MoveContext(origin = null, piece = null, game = null, calculateAttackAnnotation = true) {
    this.origin = origin;
    this.piece = piece;
    this.game = game;
    this.calculateAttackAnnotation = calculateAttackAnnotation;
}*/

function decorateAbstractPiece(piece, color) {
    piece.color = color;
    piece.validTargetFields = validTargetFields;
    //piece.isValidMove = isValidMove;
}

// Check if a capture can be performed from this position
function isAttackPosition(context, field) {
    if (!(context && field && context.piece && context.game)) return false;

    let piece = context.piece;
    let newContext = new MoveContext(field, piece, context.game, false);
    let movesFromPosition = piece.validTargetFields(newContext);

    return movesFromPosition.filter(s => s.annotations.capture).length > 0;
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
                step.annotations.capture = true;
                result.push(step);
            }
            break;
        }

        if (context && context.calculateAttackAnnotation && isAttackPosition(context, relativeToAbsolute(step, context.origin))) {
            step.annotations.attack = true;    
        }
        
        result.push(step);
    }

    return result;
}

function straightPathRelative(context = null, distance = 8) {
    let result = 
        path(1, 0, distance, context)
        .concat(path(-1, 0, distance, context))
        .concat(path(0, 1, distance, context))
        .concat(path(0, -1, distance, context))
        .sort(compareFields);
  
    return result;
}

function diagonalPathRelative(context = null, distance = 8) {
    let result = 
        path(1, 1, distance, context)
        .concat(path(-1, 1, distance, context))
        .concat(path(1, -1, distance, context))
        .concat(path(-1, -1, distance, context))
        .sort(compareFields);
  
    return result;
}

function validTargetFields(context) {
    let relativeMoves = this.validTargetFieldsRelative(context);
    
    let result = relativeMoves
        .map(e => relativeToAbsolute(e, context.origin))
        .filter(e => e != null).sort(compareFields);

    return result;
}

/*function isValidMove(context, target) {
    return this.validTargetFields(context).find(m => m.equals(target))
}*/

function Pawn(color) {

    decorateAbstractPiece(this, color);

    this.getFace = function() {
        return (this.color == WHITE) ? '♙' : '♟︎';
    }

    this.validTargetFieldsRelative = function(context = null) {
        let distance = 1//!this.firstMove ? 1 : 2;
        let direction = this.color == WHITE ? 1 : -1;
        
        // On first move, pawn can move to spaces
        if (context && context.origin) {
            distance = this.isInitialPosition(context.origin) ? 2 : 1;
        }

        // move capture flag to context?
        let result = path(0, direction, distance, context, false);

        if (context) {
            // pawns capture diagonal
            // try to call path function here
            let pathLeft = new Field(-1, direction);
            let pieceLeft = collision(context.game, pathLeft, context.origin);

            if (pieceLeft && pieceLeft.color !== this.color) {
                pathLeft.annotations.capture = true;
                result.push(pathLeft);
            }

            // pawns capture diagonal
            // try to call path function here
            let pathRight = new Field(1, direction);
            let pieceRight = collision(context.game, pathRight, context.origin);

            if (pieceRight && pieceRight.color !== this.color) {
                pathRight.annotations.capture = true;
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
    
    this.validTargetFieldsRelative = straightPathRelative;
}

function Knight(color) {
    decorateAbstractPiece(this, color);

    this.getFace = function() {
        return (this.color == WHITE) ? '♘' : '♞';
    }

    this.validTargetFieldsRelative = function(context = null) {
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
        .map(s => {
            if (context && collision(context.game, s, context.origin)) {
                s.annotations.capture = true;
            }

            if (context && context.calculateAttackAnnotation && isAttackPosition(context, relativeToAbsolute(s, context.origin))) {
                s.annotations.attack = true;    
            }
        
            return s;
        })
        .sort(compareFields);
    }
}

function Bishop(color) {
    decorateAbstractPiece(this, color);

    this.getFace = function() {
        return (this.color == WHITE) ? '♗' : '♝';
    }

    this.validTargetFieldsRelative = diagonalPathRelative;
}

function Queen(color) {
    decorateAbstractPiece(this, color);
    
    this.getFace = function() {
        return (this.color == WHITE) ? '♕' : '♛';
    }

    this.validTargetFieldsRelativeStraight = straightPathRelative;
    this.validTargetFieldsRelativeDiagonal = diagonalPathRelative;
    
    this.validTargetFieldsRelative = function(context = null) {
        return this.validTargetFieldsRelativeStraight(context).concat(this.validTargetFieldsRelativeDiagonal(context)).sort(compareFields);
    }
}

// TODO: Move must not end in check! (For every move of every piece!)
function King(color) {
    decorateAbstractPiece(this, color);

    this.getFace = function() {
        return (this.color == WHITE) ? '♔' : '♚';
    }

    this.validTargetFieldsRelativeStraight = straightPathRelative;
    this.validTargetFieldsRelativeDiagonal = diagonalPathRelative;
    
    this.validTargetFieldsRelative = function(context = null) {
        return this.validTargetFieldsRelativeStraight(context, 1)
            .concat(this.validTargetFieldsRelativeDiagonal(context, 1))
            .concat(this.kingSideCastleMove(context))
            .concat(this.queenSideCastleMove(context))
            .sort(compareFields);
    },

    // should not use annotation to create special move, instead create move object that holds special move method
    this.kingSideCastleMove = function(context) {
        let column = this.color === WHITE ? 2 : -2;
        return (this.canPerformKingSideCastling(context)) ? [ new Field(column, 0, { kingsSideCastle: true }) ] : [];
    }

    this.canPerformKingSideCastling = function(context = null) {
        if (!context || !context.game) return false;

        // Rule 1: King must be on initial position (TODO: must not have moved yet!)
        var kingInInitialPosition = (this.color === WHITE && context.origin === fields.e1) || (this.color === BLACK && context.origin === fields.d8);
        
        // Rule 2: Rook must be on initial position (TODO: must not have moved yet!)
        var expectedRookPosition = this.color === WHITE ? fields.h1 : fields.a8;
        var rook = context.game.getPieceAt(expectedRookPosition);

        var rookInInitialPosition = rook instanceof Rook && this.color === rook.color;

        // Rule 3: Intermediate positions must be empty
        var expectedEmptyPositions = this.color === WHITE ? [ fields.f1, fields.g1 ] : [ fields.b8, fields.c8 ]

        // Rule 4: TODO: King must not be in check (attacked) on any of the fields it is before, during or after the castle

        // todo: nice map stuff
        var intermediatePositionsEmpty = !(context.game.getPieceAt(expectedEmptyPositions[0]) || context.game.getPieceAt(expectedEmptyPositions[1]));

        return kingInInitialPosition && rookInInitialPosition && intermediatePositionsEmpty;
    }

        // should not use annotation to create special move, instead create move object that holds special move method
    this.queenSideCastleMove = function(context) {
        let column = this.color === BLACK ? 2 : -2;
        return (this.canPerformQueenSideCastling(context)) ? [ new Field(column, 0, { queenSideCastle: true }) ] : [];
    }

    this.canPerformQueenSideCastling = function(context = null) {
        if (!context || !context.game) return false;

        // Rule 1: King must be on initial position (TODO: must not have moved yet!)
        var kingInInitialPosition = (this.color === WHITE && context.origin === fields.e1) || (this.color === BLACK && context.origin === fields.d8);
        
        // Rule 2: Rook must be on initial position (TODO: must not have moved yet!)
        var expectedRookPosition = this.color === WHITE ? fields.a1 : fields.h8;
        var rook = context.game.getPieceAt(expectedRookPosition);

        var rookInInitialPosition = rook instanceof Rook && this.color === rook.color;

        // Rule 3: Intermediate positions must be empty
        var expectedEmptyPositions = this.color === WHITE ? [ fields.b1, fields.d1 ] : [ fields.e8, fields.f8 ]

        // Rule 4: TODO: King must not be in check (attacked) on any of the fields it is before, during or after the castle

        // todo: nice map stuff
        var intermediatePositionsEmpty = !(context.game.getPieceAt(expectedEmptyPositions[0]) || context.game.getPieceAt(expectedEmptyPositions[1]));

        return kingInInitialPosition && rookInInitialPosition && intermediatePositionsEmpty;
    }
}



export { Pawn, Rook, Knight, Bishop, Queen, King, BLACK, WHITE };