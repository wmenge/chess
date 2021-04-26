import nanotest from '/node_modules/@wmenge/nanotest/index.js';

import { game } from '/game.js';
import { Field, Pawn, Rook, Knight, Bishop, Queen, King, BLACK, WHITE } from '/pieces.js';

/*let relativeToAbsoluteTests = {
    testMoveUp() {
        let relativeField = new Field(0, 1);
        let origin = new Field('a', 5);
        nanotest.assertEqualsArrays(new Field('a', 6), relativeToAbsolute(relativeField, origin));
    },
    testMoveDown() {
        let relativeField = new Field(0, -1);
        let origin = new Field('a', 5);
        nanotest.assertEqualsArrays(new Field('a', 4), relativeToAbsolute(relativeField, origin));
    },
    testMoveRight() {
        let relativeField = new Field(1, 0);
        let origin = new Field('a', 5);
        nanotest.assertEqualsArrays(new Field('b', 5), relativeToAbsolute(relativeField, origin));
    },
    testMoveLeft() {
        let relativeField = new Field(-1, 0);
        let origin = new Field('b', 5);
        nanotest.assertEqualsArrays(new Field('a', 5), relativeToAbsolute(relativeField, origin));
    },
    testMoveOutOfColumnsUpperBound() {
        let relativeField = new Field(1, 0);
        let origin = new Field('h', 5);
        nanotest.assertNull(relativeToAbsolute(relativeField, origin));
    },
    testMoveOutOfColumnsLowerBound() {
        let relativeField = new Field(-1, 0);
        let origin = new Field('a', 1);
        nanotest.assertNull(relativeToAbsolute(relativeField, origin));
    },
    testMoveOutOfRowsUpperBound() {
        let relativeField = new Field(0, 1);
        let origin = new Field('a', 8);
        nanotest.assertNull(relativeToAbsolute(relativeField, origin));
    },
    testMoveOutOfColumnsLowerBound() {
        let relativeField = new Field(0, -1);
        let origin = new Field('a', 1);
        nanotest.assertNull(relativeToAbsolute(relativeField, origin));
    }
}

nanotest.run(relativeToAbsoluteTests);*/

let pawnTests = {
    testGetFaceWhite() {
        let pawn = new Pawn(WHITE, null);
        nanotest.assertEquals('♙', pawn.getFace());
    },
    testGetFaceBlack() {
        let pawn = new Pawn(BLACK, null);
        nanotest.assertEquals('♟︎', pawn.getFace());
    },
    testMovesRelativeWhite() {
        let pawn = new Pawn(WHITE, null);
        nanotest.assertEqualsArrays([new Field(0, 1)], pawn.validMovesRelative());
    },
    testMovesRelativeBlack() {
        let pawn = new Pawn(BLACK, null);
        nanotest.assertEqualsArrays([new Field(0, -1)], pawn.validMovesRelative());
    },
    testPawnWithoutFieldHasNoValidMoves() {
        let pawn = new Pawn(BLACK, null);
        nanotest.assertNull(pawn.validMoves());
    },
    testBlackPawnWithFieldHasValidMoves() {
        let pawn = new Pawn(BLACK, new Field('a', 7));
        nanotest.assertEqualsArrays([new Field('a', 6)], pawn.validMoves());
    },
    testWhitePawnWithFieldHasValidMoves() {
        let pawn = new Pawn(WHITE, new Field('d', 2));
        nanotest.assertEqualsArrays([new Field('d', 3)], pawn.validMoves());
    },
    testPawnWithDefinedInitialStateHasTwoMoves() {
        let pawn = new Pawn(WHITE, null, true);
        nanotest.assertEqualsArrays([new Field(0, 1), new Field(0, 2)], pawn.validMovesRelative());
    },
    testPawnWithDefinedNotInitialStateHasOneMove() {
        let pawn = new Pawn(WHITE, null, false);
        nanotest.assertEqualsArrays([new Field(0, 1)], pawn.validMovesRelative());
    },
    testIsValidMove() {
        let pawn = new Pawn(WHITE, new Field('d', 2));
        nanotest.assertTrue(pawn.isValidMove(new Field('d', 3)));
    },
    testIsNotValidMove() {
        let pawn = new Pawn(WHITE, new Field('d', 2));
        nanotest.assertTrue(!pawn.isValidMove(new Field('2', 2)));
    }
}

let rookTests = {
    testGetFaceWhite() {
        let rook = new Rook(WHITE, null);
        nanotest.assertEquals('♖', rook.getFace());
    },
    testGetFaceBlack() {
        let rook = new Rook(BLACK, null);
        nanotest.assertEquals('♜', rook.getFace());
    },
    testMovesRelative() {
        let rook = new Rook(WHITE, null);
        nanotest.assertEqualsArrays([
            new Field(-8, 0),
            new Field(-7, 0),
            new Field(-6, 0),
            new Field(-5, 0),
            new Field(-4, 0),
            new Field(-3, 0),
            new Field(-2, 0),
            new Field(-1, 0),
            new Field(0, -8),
            new Field(0, -7),
            new Field(0, -6),
            new Field(0, -5),
            new Field(0, -4),
            new Field(0, -3),
            new Field(0, -2),
            new Field(0, -1),
            new Field(0, 1),
            new Field(0, 2),
            new Field(0, 3),
            new Field(0, 4),
            new Field(0, 5),
            new Field(0, 6),
            new Field(0, 7),
            new Field(0, 8),
            new Field(1, 0),
            new Field(2, 0),
            new Field(3, 0),
            new Field(4, 0),
            new Field(5, 0),
            new Field(6, 0),
            new Field(7, 0),
            new Field(8, 0)
            ], rook.validMovesRelative());
    },
    testMoves() {
        let rook = new Rook(WHITE, new Field('a', 1));
        nanotest.assertEqualsArrays([
            new Field('a', 2),
            new Field('a', 3),
            new Field('a', 4),
            new Field('a', 5),
            new Field('a', 6),
            new Field('a', 7),
            new Field('a', 8),
            new Field('b', 1),
            new Field('c', 1),
            new Field('d', 1),
            new Field('e', 1),
            new Field('f', 1),
            new Field('g', 1),
            new Field('h', 1)
            ], rook.validMoves());
    },
    testCollision() {
        let pawn = new Pawn(WHITE, new Field('a', 2));
        let rook = new Rook(WHITE, new Field('a', 1), game);
        let knight = new Knight(WHITE, new Field('b', 1));

        game.clear();

        game.add(pawn);
        game.add(rook);
        game.add(knight);

        // rook cannot move as it is enclosed by a pawn and a knight
        nanotest.assertEqualsArrays([], rook.validMoves());
    }

}

let knightTests = {
    testGetFaceWhite() {
        let knight = new Knight(WHITE, null);
        nanotest.assertEquals('♘', knight.getFace());
    },
    testGetFaceBlack() {
        let knight = new Knight(BLACK, null);
        nanotest.assertEquals('♞', knight.getFace());
    },
    testMovesRelative() {
        let knight = new Knight(WHITE, null);
        nanotest.assertEqualsArrays([
            new Field(-2, -1),
            new Field(-2, 1),
            new Field(-1, -2),
            new Field(-1, 2),
            new Field(1, -2),
            new Field(1, 2),
            new Field(2, -1),
            new Field(2, 1)            
        ], knight.validMovesRelative());
    },
    testMoves() {
        let knight = new Knight(WHITE, new Field('b', 1));
        nanotest.assertEqualsArrays([
            new Field('a', 3),
            new Field('c', 3),
            new Field('d', 2)
        ], knight.validMoves());
    },

}

let bishopTests = {
    testGetFaceWhite() {
        let bishop = new Bishop(WHITE, null);
        nanotest.assertEquals('♗', bishop.getFace());
    },
    testGetFaceBlack() {
        let bishop = new Bishop(BLACK, null);
        nanotest.assertEquals('♝', bishop.getFace());
    },
    testMovesRelative() {
        let bishop = new Bishop(WHITE, null);

        nanotest.assertEqualsArrays([
            new Field(-8, -8),
            new Field(-8, 8),
            new Field(-7, -7),
            new Field(-7, 7),
            new Field(-6, -6),
            new Field(-6, 6),
            new Field(-5, -5),
            new Field(-5, 5),
            new Field(-4, -4),
            new Field(-4, 4),
            new Field(-3, -3),
            new Field(-3, 3),
            new Field(-2, -2),
            new Field(-2, 2),
            new Field(-1, -1),
            new Field(-1, 1),
            new Field(1, -1),
            new Field(1, 1),
            new Field(2, -2),
            new Field(2, 2),
            new Field(3, -3),
            new Field(3, 3),
            new Field(4, -4),
            new Field(4, 4),
            new Field(5, -5),
            new Field(5, 5),
            new Field(6, -6),
            new Field(6, 6),
            new Field(7, -7),
            new Field(7, 7),
            new Field(8, -8),
            new Field(8, 8)
            ], bishop.validMovesRelative());
    },
    testMoves() {
        let bishop = new Bishop(WHITE, new Field('b', 1));
        
        nanotest.assertEqualsArrays([
            new Field('a', 2),
            new Field('c', 2),
            new Field('d', 3),
            new Field('e', 4),
            new Field('f', 5),
            new Field('g', 6),
            new Field('h', 7)
            ], bishop.validMoves());
    },
}



let queenTests = {
    testGetFaceWhite() {
        let queen = new Queen(WHITE, null);
        nanotest.assertEquals('♕', queen.getFace());
    },
    testGetFaceBlack() {
        let queen = new Queen(BLACK, null);
        nanotest.assertEquals('♛', queen.getFace());
    },
    testMovesRelative() {
        let queen = new Queen(WHITE, null);

        nanotest.assertEqualsArrays([
            new Field(-8, -8),
            new Field(-8, 0),
            new Field(-8, 8),
            new Field(-7, -7),
            new Field(-7, 0),
            new Field(-7, 7),
            new Field(-6, -6),
            new Field(-6, 0),
            new Field(-6, 6),
            new Field(-5, -5),
            new Field(-5, 0),
            new Field(-5, 5),
            new Field(-4, -4),
            new Field(-4, 0),
            new Field(-4, 4),
            new Field(-3, -3),
            new Field(-3, 0),
            new Field(-3, 3),
            new Field(-2, -2),
            new Field(-2, 0),
            new Field(-2, 2),
            new Field(-1, -1),
            new Field(-1, 0),
            new Field(-1, 1),
            new Field(0, -8),
            new Field(0, -7),
            new Field(0, -6),
            new Field(0, -5),
            new Field(0, -4),
            new Field(0, -3),
            new Field(0, -2),
            new Field(0, -1),
            new Field(0, 1),
            new Field(0, 2),
            new Field(0, 3),
            new Field(0, 4),
            new Field(0, 5),
            new Field(0, 6),
            new Field(0, 7),
            new Field(0, 8),
            new Field(1, -1),
            new Field(1, 0),
            new Field(1, 1),
            new Field(2, -2),
            new Field(2, 0),
            new Field(2, 2),
            new Field(3, -3),
            new Field(3, 0),
            new Field(3, 3),
            new Field(4, -4),
            new Field(4, 0),
            new Field(4, 4),
            new Field(5, -5),
            new Field(5, 0),
            new Field(5, 5),
            new Field(6, -6),
            new Field(6, 0),
            new Field(6, 6),
            new Field(7, -7),
            new Field(7, 0),
            new Field(7, 7),
            new Field(8, -8),
            new Field(8, 0),
            new Field(8, 8)
            ], queen.validMovesRelative());
    },
    testMoves() {
        let queen = new Queen(WHITE, new Field('a', 1));

        nanotest.assertEqualsArrays([
            new Field('a', 2),
            new Field('a', 3),
            new Field('a', 4),
            new Field('a', 5),
            new Field('a', 6),
            new Field('a', 7),
            new Field('a', 8),
            new Field('b', 1),
            new Field('b', 2),
            new Field('c', 1),
            new Field('c', 3),
            new Field('d', 1),
            new Field('d', 4),
            new Field('e', 1),
            new Field('e', 5),
            new Field('f', 1),
            new Field('f', 6),
            new Field('g', 1),
            new Field('g', 7),
            new Field('h', 1),
            new Field('h', 8)
            ], queen.validMoves());
    },
}


let kingTests = {
    testGetFaceWhite() {
        let king = new King(WHITE, null);
        nanotest.assertEquals('♔', king.getFace());
    },
    testGetFaceBlack() {
        let king = new King(BLACK, null);
        nanotest.assertEquals('♚', king.getFace());
    },
    testMovesRelative() {
        let king = new King(WHITE, null);

        nanotest.assertEqualsArrays([
            new Field(-1, -1),
            new Field(-1, 0),
            new Field(-1, 1),
            new Field(0, -1),
            new Field(0, 1),
            new Field(1, -1),
            new Field(1, 0),
            new Field(1, 1)
            ], king.validMovesRelative());
    },
    testMoves() {
        let king = new King(WHITE, new Field('b', 1));

        nanotest.assertEqualsArrays([
            new Field('a', 1),
            new Field('a', 2),
            new Field('b', 2),
            new Field('c', 1),
            new Field('c', 2)
            ], king.validMoves());
    },
}

function runTests() {
    nanotest.run(pawnTests);
    nanotest.run(rookTests);
    nanotest.run(knightTests);
    nanotest.run(bishopTests);
    nanotest.run(queenTests);
    nanotest.run(kingTests);
}

export { runTests };