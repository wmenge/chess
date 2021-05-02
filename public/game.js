import { Field, Pawn, Rook, Knight, Bishop, Queen, King, BLACK, WHITE } from '/pieces.js';

// do we ever need multiple games? how?
let game = {

    // maybe a map of field => piece?
    pieces: [],
    capturedPieces: [],
    // somehow make current color/having turns optional?
    currentColor: null,

    et: new EventTarget(),

    setup() {

        this.clear();

        this.currentColor =  WHITE;

        this.add(new Pawn(WHITE, new Field('a', 2), this, true));
        this.add(new Pawn(WHITE, new Field('b', 2), this, true));
        this.add(new Pawn(WHITE, new Field('c', 2), this, true));
        this.add(new Pawn(WHITE, new Field('d', 2), this, true));
        this.add(new Pawn(WHITE, new Field('e', 2), this, true));
        this.add(new Pawn(WHITE, new Field('f', 2), this, true));
        this.add(new Pawn(WHITE, new Field('g', 2), this, true));
        this.add(new Pawn(WHITE, new Field('h', 2), this, true));

        this.add(new Rook(WHITE, new Field('a', 1), this));
        this.add(new Knight(WHITE, new Field('b', 1), this));
        this.add(new Bishop(WHITE, new Field('c', 1), this));
        this.add(new Queen(WHITE, new Field('d', 1), this));
        this.add(new King(WHITE, new Field('e', 1), this));
        this.add(new Bishop(WHITE, new Field('f', 1), this));
        this.add(new Knight(WHITE, new Field('g', 1), this));
        this.add(new Rook(WHITE, new Field('h', 1), this));

        this.add(new Pawn(BLACK, new Field('a', 7), this, true));
        this.add(new Pawn(BLACK, new Field('b', 7), this, true));
        this.add(new Pawn(BLACK, new Field('c', 7), this, true));
        this.add(new Pawn(BLACK, new Field('d', 7), this, true));
        this.add(new Pawn(BLACK, new Field('e', 7), this, true));
        this.add(new Pawn(BLACK, new Field('f', 7), this, true));
        this.add(new Pawn(BLACK, new Field('g', 7), this, true));
        this.add(new Pawn(BLACK, new Field('h', 7), this, true));

        this.add(new Rook(BLACK, new Field('a', 8), this));
        this.add(new Knight(BLACK, new Field('b', 8), this));
        this.add(new Bishop(BLACK, new Field('c', 8), this));
        this.add(new Queen(BLACK, new Field('d', 8), this));
        this.add(new King(BLACK, new Field('e', 8), this));
        this.add(new Bishop(BLACK, new Field('f', 8), this));
        this.add(new Knight(BLACK, new Field('g', 8), this));
        this.add(new Rook(BLACK, new Field('h', 8), this));

        this.et.dispatchEvent(new CustomEvent("setup", { detail: { game: this }}));
    },

    add(piece) {
        this.pieces.push(piece);
        this.et.dispatchEvent(new CustomEvent("add-piece", { detail: piece }));
    },

    getPieceAt(field) {
        // Temp hack!
        if (!field) return null;
        return this.pieces.find(p => field.equals(p.field));
    },

    clear() {
        this.pieces = [];
        this.capturedPieces = [];
        this.et.dispatchEvent(new Event("clear"));
    },

    move(piece, target) {
        let i = this.pieces.indexOf(piece);

        // todo: validate capture
        if (game.getPieceAt(target)) {
            this.capture(target);
        }

        // instead of mutating piece, create a new instance
        // unintented but nice side effect: pawn.firstmove gets set to false
        this.pieces[i] = new piece.constructor(piece.color, target, this);

        if (this.currentColor) {
            this.currentColor = this.currentColor == WHITE ? BLACK : WHITE;
        }

        // todo: validate!
        this.et.dispatchEvent(new CustomEvent("move", { detail: { piece: piece, target: target, game: this }}));
    },

    capture(field) {
        let capturedPiece = game.getPieceAt(field);
        //this.pieces.remove(capturedPiece);
        this.pieces = this.pieces.filter(p => p !== capturedPiece);
        this.capturedPieces.push(new capturedPiece.constructor(capturedPiece.color, field, this));

        this.et.dispatchEvent(new CustomEvent("capture", { detail: { piece: capturedPiece, target: field }}));
    }
}

export { game }