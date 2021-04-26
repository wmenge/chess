import { Field, Pawn, Rook, Knight, Bishop, Queen, King, BLACK, WHITE } from '/pieces.js';

// do we ever need multiple games? how?
let game = {

    // maybe a map of field => piece?
    pieces: [],

    et: new EventTarget(),

    setup() {

        this.clear();

        this.add(new Pawn(WHITE, new Field('a', 2), true));
        this.add(new Pawn(WHITE, new Field('b', 2), true));
        this.add(new Pawn(WHITE, new Field('c', 2), true));
        this.add(new Pawn(WHITE, new Field('d', 2), true));
        this.add(new Pawn(WHITE, new Field('e', 2), true));
        this.add(new Pawn(WHITE, new Field('f', 2), true));
        this.add(new Pawn(WHITE, new Field('g', 2), true));
        this.add(new Pawn(WHITE, new Field('h', 2), true));

        this.add(new Rook(WHITE, new Field('a', 1), this));
        this.add(new Knight(WHITE, new Field('b', 1)));
        this.add(new Bishop(WHITE, new Field('c', 1)));
        this.add(new Queen(WHITE, new Field('d', 1)));
        this.add(new King(WHITE, new Field('e', 1)));
        this.add(new Bishop(WHITE, new Field('f', 1)));
        this.add(new Knight(WHITE, new Field('g', 1)));
        this.add(new Rook(WHITE, new Field('h', 1), this));

        this.add(new Pawn(BLACK, new Field('a', 7), true));
        this.add(new Pawn(BLACK, new Field('b', 7), true));
        this.add(new Pawn(BLACK, new Field('c', 7), true));
        this.add(new Pawn(BLACK, new Field('d', 7), true));
        this.add(new Pawn(BLACK, new Field('e', 7), true));
        this.add(new Pawn(BLACK, new Field('f', 7), true));
        this.add(new Pawn(BLACK, new Field('g', 7), true));
        this.add(new Pawn(BLACK, new Field('h', 7), true));

        this.add(new Rook(BLACK, new Field('a', 8), this));
        this.add(new Knight(BLACK, new Field('b', 8)));
        this.add(new Bishop(BLACK, new Field('c', 8)));
        this.add(new Queen(BLACK, new Field('d', 8)));
        this.add(new King(BLACK, new Field('e', 8)));
        this.add(new Bishop(BLACK, new Field('f', 8)));
        this.add(new Knight(BLACK, new Field('g', 8)));
        this.add(new Rook(BLACK, new Field('h', 8), this));
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
        this.et.dispatchEvent(new Event("clear"));
    },

    move(piece, target) {
        let i = this.pieces.indexOf(piece);

        // instead of mutating piece, create a new instance
        // unintented but nice side effect: pawn.firstmove gets set to false
        this.pieces[i] = new piece.constructor(piece.color, target, this);

        // todo: validate!
        this.et.dispatchEvent(new CustomEvent("move", { detail: { piece: piece, target: target }}));
    }
}

export { game }