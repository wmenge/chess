import { fields, relativeToAbsolute } from '/fields.js';
import { Pawn, Rook, Knight, Bishop, Queen, King, BLACK, WHITE } from '/pieces.js';
import { MoveContext, Move } from '/move.js';

// do we ever need multiple games? yes we do
let game = {

    pieces: {},
    moves: [],
    capturedPieces: [],
    // somehow make current color/having turns optional?
    currentColor: null,

    et: new EventTarget(),

    setup() {

        this.clear();

        this.add(new Pawn(WHITE), fields.a2);
        this.add(new Pawn(WHITE), fields.b2);
        this.add(new Pawn(WHITE), fields.c2);
        this.add(new Pawn(WHITE), fields.d2);
        this.add(new Pawn(WHITE), fields.e2);
        this.add(new Pawn(WHITE), fields.f2);
        this.add(new Pawn(WHITE), fields.g2);
        this.add(new Pawn(WHITE), fields.h2);

        this.add(new Rook(WHITE), fields.a1);
        this.add(new Knight(WHITE), fields.b1);
        this.add(new Bishop(WHITE), fields.c1);
        this.add(new Queen(WHITE), fields.d1);
        this.add(new King(WHITE), fields.e1);
        this.add(new Bishop(WHITE), fields.f1);
        this.add(new Knight(WHITE), fields.g1);
        this.add(new Rook(WHITE), fields.h1);

        this.add(new Pawn(BLACK), fields.a7);
        this.add(new Pawn(BLACK), fields.b7);
        this.add(new Pawn(BLACK), fields.c7);
        this.add(new Pawn(BLACK), fields.d7);
        this.add(new Pawn(BLACK), fields.e7);
        this.add(new Pawn(BLACK), fields.f7);
        this.add(new Pawn(BLACK), fields.g7);
        this.add(new Pawn(BLACK), fields.h7);

        this.add(new Rook(BLACK), fields.a8);
        this.add(new Knight(BLACK), fields.b8);
        this.add(new Bishop(BLACK), fields.c8);
        this.add(new Queen(BLACK), fields.d8);
        this.add(new King(BLACK), fields.e8);
        this.add(new Bishop(BLACK), fields.f8);
        this.add(new Knight(BLACK), fields.g8);
        this.add(new Rook(BLACK), fields.h8);

        this.et.dispatchEvent(new CustomEvent("setup", { detail: { game: this }}));

        // allows UI to update with css transitions
        // when called with await
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, 0);
        });
    },

    add(piece, field) {
        this.pieces[field.toString()] = piece;
        this.et.dispatchEvent(new CustomEvent("add-piece", { detail: { piece: piece, field: field }}));
    },

    getPieceAt(field) {
        // Temp hack!
        if (!field) return null;
        return this.pieces[field.toString()];
    },

    getFieldOf(piece) {
        if (!piece) return null;
        let result = Object.keys(this.pieces).find(k => this.pieces[k] == piece);
        if (result) return result[0];
    },

    clear() {
        this.pieces = {};
        this.capturedPieces = [];
        this.currentColor = WHITE;
        this.et.dispatchEvent(new Event("clear"));
    },

    hasCurrentTurn(color) {
        return (!this.currentColor || color == this.currentColor);
    },

    // to Move

    /*isValidMove(origin, target) {
        let piece = this.getPieceAt(origin);
        let moveContext = new MoveContext(origin, piece, this);
        return piece.isValidMove(moveContext, target);
    },*/

    // not a public function! should only be called by move
    perform(move) {

        if (!move.isValid()) return false;

        delete this.pieces[move.context.origin.toString()];
        this.pieces[move.target.toString()] = move.context.piece;





        /*if (this.game.getPieceAt(this.target)) {
            this.game.capture(this.target);
        }

        if (this.currentColor) {
            this.currentColor = this.currentColor == WHITE ? BLACK : WHITE;
        }*/
    },

    toggleTurn() {
        if (this.currentColor) {
            this.currentColor = this.currentColor == WHITE ? BLACK : WHITE;
        }
    },

    // move logic to Move object?
    /*move(move) {
        //let piece = this.getPieceAt(origin);

        //let context = new MoveContext(origin, piece, this);
        //let move = new Move(target, context);

        if (!move.isValid()) {
            console.error("Illegal move: %o to %o", origin, target);
            return false;  
        } 

        // todo: validate capture
        if (this.getPieceAt(target)) {
            this.capture(target);
        }

        // move into switch color method. call method as reaction to move event
        if (this.currentColor) {
            this.currentColor = this.currentColor == WHITE ? BLACK : WHITE;
        }

        // this should be in separeate method of special case move object
        /*let moveContext = new MoveContext(origin, piece, this);
        if (piece instanceof King && piece.color == WHITE && piece.canPerformKingSideCastling(moveContext) && target.equals(relativeToAbsolute(piece.kingSideCastleMove(moveContext)[0],origin))) {
            var rook = this.getPieceAt(fields.h1);
            delete this.pieces[fields.h1.toString()];
            this.pieces[fields.f1.toString()] = rook;
            this.et.dispatchEvent(new CustomEvent("move", { detail: { origin: fields.h1, piece: rook, target: fields.f1, game: this }}));   
        }

        if (piece instanceof King && piece.color == BLACK && piece.canPerformKingSideCastling(moveContext) && target.equals(relativeToAbsolute(piece.kingSideCastleMove(moveContext)[0],origin))) {
            var rook = this.getPieceAt(fields.a8);
            delete this.pieces[fields.a8.toString()];
            this.pieces[fields.c8.toString()] = rook;
            this.et.dispatchEvent(new CustomEvent("move", { detail: { origin: fields.a8, piece: rook, target: fields.c8, game: this }}));   
        }

        if (piece instanceof King && piece.color == WHITE && piece.canPerformQueenSideCastling(moveContext) && target.equals(relativeToAbsolute(piece.queenSideCastleMove(moveContext)[0],origin))) {
            var rook = this.getPieceAt(fields.a1);
            delete this.pieces[fields.a1.toString()];
            this.pieces[fields.d1.toString()] = rook;
            this.et.dispatchEvent(new CustomEvent("move", { detail: { origin: fields.a1, piece: rook, target: fields.d1, game: this }}));   
        }

        if (piece instanceof King && piece.color == BLACK && piece.canPerformQueenSideCastling(moveContext) && target.equals(relativeToAbsolute(piece.queenSideCastleMove(moveContext)[0],origin))) {
            var rook = this.getPieceAt(fields.h8);
            delete this.pieces[fields.h8.toString()];
            this.pieces[fields.e8.toString()] = rook;
            this.et.dispatchEvent(new CustomEvent("move", { detail: { origin: fields.h8, piece: rook, target: fields.e8, game: this }}));   
        }*/

        /*delete this.pieces[origin.toString()];
        this.pieces[target.toString()] = piece;
        this.et.dispatchEvent(new CustomEvent("move", { detail: { origin: origin, piece: piece, target: target, game: this }}));

        // allows UI to update with css transitions
        // when called with await
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, 500);
        });
    },*/

    capture(field) {
        let capturedPiece = this.getPieceAt(field);
        this.capturedPieces.push(capturedPiece);
        delete this.pieces[field.toString()];

        this.et.dispatchEvent(new CustomEvent("capture", { detail: { piece: capturedPiece, target: field }}));
    }
}

export { game }