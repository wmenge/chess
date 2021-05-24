import { fields } from '/fields.js';

// do we ever need multiple games? how?
let game = {

    pieces: new Map(),
    capturedPieces: [],
    // somehow make current color/having turns optional?
    currentColor: null,

    et: new EventTarget(),

    setup() {

        this.clear();

        this.currentColor =  WHITE;

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
    },

    add(piece, field) {
        this.pieces.set(field, piece);
        this.et.dispatchEvent(new CustomEvent("add-piece", { detail: { piece: piece, field: field }}));
    },

    getPieceAt(field) {
        // Temp hack!
        if (!field) return null;
        return this.pieces.get(field);
    },

    getFieldOf(piece) {
        if (!piece) return null;
        let result = Array.from(this.pieces.entries()).find(e => piece === e[1]);
        if (result) return result[0];
    },

    clear() {
        this.pieces = new Map();
        this.capturedPieces = [];
        this.currentColor = null;
        this.et.dispatchEvent(new Event("clear"));
    },

    hasCurrentTurn(color) {
        return (!this.currentColor || color == this.currentColor);
    },

    isValidMove(origin, target) {
        let piece = this.getPieceAt(origin);
        let moveContext = new MoveContext(origin, piece, this);
        return piece.isValidMove(moveContext, target);
    },

    // todo: validate!
    move(origin, target) {
        let piece = this.getPieceAt(origin);

        if (!this.isValidMove(origin, target)) {
            console.error("Illegal move: %o to %o", origin, target);
            return false;  
        } 

        // todo: validate capture
        if (this.getPieceAt(target)) {
            this.capture(target);
        }

        this.pieces.delete(origin);
        this.pieces.set(target, piece);

        // move into switch color method. call method as reaction to move event
        if (this.currentColor) {
            this.currentColor = this.currentColor == WHITE ? BLACK : WHITE;
        }

        this.et.dispatchEvent(new CustomEvent("move", { detail: { origin: origin, piece: piece, target: target, game: this }}));
    },

    capture(field) {
        let capturedPiece = this.getPieceAt(field);
        this.capturedPieces.push(capturedPiece);
        this.pieces.delete(field);

        this.et.dispatchEvent(new CustomEvent("capture", { detail: { piece: capturedPiece, target: field }}));
    }
}

export { game }