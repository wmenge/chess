import nanotest from '/node_modules/@wmenge/nanotest/index.js';

import { game } from '/game.js';
import { fields, Field,  PathContext, Pawn, Rook, Knight, Bishop, Queen, King, BLACK, WHITE } from '/pieces.js';

/*let relativeToAbsoluteTests = {
    testMoveUp() {
        let relativeField = new Field(0, 1);
        let origin = fields.a5;
        nanotest.assertEqualsArrays(fields.a6, relativeToAbsolute(relativeField, origin));
    },
    testMoveDown() {
        let relativeField = new Field(0, -1);
        let origin = fields.a5;
        nanotest.assertEqualsArrays(fields.a4, relativeToAbsolute(relativeField, origin));
    },
    testMoveRight() {
        let relativeField = new Field(1, 0);
        let origin = fields.a5;
        nanotest.assertEqualsArrays(fields.b5, relativeToAbsolute(relativeField, origin));
    },
    testMoveLeft() {
        let relativeField = new Field(-1, 0);
        let origin = fields.b5;
        nanotest.assertEqualsArrays(fields.a5, relativeToAbsolute(relativeField, origin));
    },
    testMoveOutOfColumnsUpperBound() {
        let relativeField = new Field(1, 0);
        let origin = fields.h5;
        nanotest.assertNull(relativeToAbsolute(relativeField, origin));
    },
    testMoveOutOfColumnsLowerBound() {
        let relativeField = new Field(-1, 0);
        let origin = fields.a1;
        nanotest.assertNull(relativeToAbsolute(relativeField, origin));
    },
    testMoveOutOfRowsUpperBound() {
        let relativeField = new Field(0, 1);
        let origin = fields.a8;
        nanotest.assertNull(relativeToAbsolute(relativeField, origin));
    },
    testMoveOutOfColumnsLowerBound() {
        let relativeField = new Field(0, -1);
        let origin = fields.a1;
        nanotest.assertNull(relativeToAbsolute(relativeField, origin));
    }
}

nanotest.run(relativeToAbsoluteTests);*/

let pawnTests = {
    testGetFaceWhite() {
        let pawn = new Pawn(WHITE);
        nanotest.assertEquals('♙', pawn.getFace());
    },
    testGetFaceBlack() {
        let pawn = new Pawn(BLACK);
        nanotest.assertEquals('♟︎', pawn.getFace());
    },
    testMovesRelativeWhite() {
        let pawn = new Pawn(WHITE);
        nanotest.assertEqualsArrays([new Field(0, 1)], pawn.validMovesRelative());
    },
    testMovesRelativeBlack() {
        let pawn = new Pawn(BLACK);
        nanotest.assertEqualsArrays([new Field(0, -1)], pawn.validMovesRelative());
    },
    /*testPawnWithoutFieldHasNoValidMoves() {
        let pawn = new Pawn(BLACK);
        nanotest.assertNull(pawn.validMoves());
    },*/
    testBlackPawnWithFieldHasValidMoves() {
        let pawn = new Pawn(BLACK);
        let context = new PathContext(fields.a7);
        nanotest.assertEqualsArrays([fields.a5, fields.a6], pawn.validMoves(context));
    },
    testWhitePawnWithFieldHasValidMoves() {
        let pawn = new Pawn(WHITE);
        let context = new PathContext(fields.d2);
        nanotest.assertEqualsArrays([fields.d3, fields.d4], pawn.validMoves(context));
    },
    testWhitePawnOnInitialPositionHasTwoMoves() {
        let pawn = new Pawn(WHITE);
        let context = new PathContext(fields.a2);
        nanotest.assertEqualsArrays([new Field(0, 1), new Field(0, 2)], pawn.validMovesRelative(context));
    },
    testWhitePawnOnNonInitialStateHasOneMove() {
        let pawn = new Pawn(WHITE);
        let context = new PathContext(fields.a3);
        nanotest.assertEqualsArrays([new Field(0, 1)], pawn.validMovesRelative(context));
    },
    testBlackPawnOnInitialPositionHasTwoMoves() {
        let pawn = new Pawn(BLACK);
        let context = new PathContext(fields.a7);
        nanotest.assertEqualsArrays([new Field(0, -1), new Field(0, -2)], pawn.validMovesRelative(context));
    },
    testBlackPawnOnNonInitialStateHasOneMove() {
        let pawn = new Pawn(BLACK);
        let context = new PathContext(fields.a6);
        nanotest.assertEqualsArrays([new Field(0, -1)], pawn.validMovesRelative(context));
    },
    testIsValidMove() {
        let pawn = new Pawn(WHITE);
        let context = new PathContext(fields.d2);
        nanotest.assertTrue(pawn.isValidMove(context, fields.d3));
    },
    testIsNotValidMove() {
        let pawn = new Pawn(WHITE);
        let context = new PathContext(fields.d2);
        nanotest.assertTrue(!pawn.isValidMove(context, fields.c2));
    },
    testPawnCapturesDiagonal() {
        let whitePawn = new Pawn(WHITE);
        let blackPawn = new Rook(BLACK);
    
        game.clear();
        game.add(whitePawn, fields.a2);
        game.add(blackPawn, fields.b3);
        
        let context = new PathContext(fields.a2, whitePawn, game);

        // white pawn can capture black pawn
        nanotest.assertTrue(whitePawn.isValidMove(context, fields.b3));
    },
    testPawnDoesNotCaptureStraight() {
        let whitePawn = new Pawn(WHITE);
        let blackPawn = new Rook(BLACK);
    
        game.clear();
        game.add(whitePawn, fields.a2);
        game.add(blackPawn, fields.a3);
        
        let context = new PathContext(fields.a2, whitePawn, game);

        // white pawn can not capture black pawn
        nanotest.assertTrue(whitePawn.isValidMove(context, fields.a3));
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
        let rook = new Rook(WHITE);
        let field = fields.a1
        let context = new PathContext(field);

        nanotest.assertEqualsArrays([
            fields.a2,
            fields.a3,
            fields.a4,
            fields.a5,
            fields.a6,
            fields.a7,
            fields.a8,
            fields.b1,
            fields.c1,
            fields.d1,
            fields.e1,
            fields.f1,
            fields.g1,
            fields.h1
            ], rook.validMoves(context));
    },
    testCollision() {
        let pawn = new Pawn(WHITE);
        let rook = new Rook(WHITE);
        let knight = new Knight(WHITE);

        game.clear();
        game.add(pawn, fields.a2);
        game.add(rook, fields.a1);
        game.add(knight, fields.b1);

        let context = new PathContext(fields.a1, rook, game);

        // rook cannot move as it is enclosed by a pawn and a knight
        nanotest.assertEqualsArrays([], rook.validMoves(context));
    }

}

let knightTests = {
    testGetFaceWhite() {
        let knight = new Knight(WHITE);
        nanotest.assertEquals('♘', knight.getFace());
    },
    testGetFaceBlack() {
        let knight = new Knight(BLACK);
        nanotest.assertEquals('♞', knight.getFace());
    },
    testMovesRelative() {
        let knight = new Knight(WHITE);
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
        let knight = new Knight(WHITE);
        let context = new PathContext(fields.b1);
        nanotest.assertEqualsArrays([
            fields.a3,
            fields.c3,
            fields.d2
        ], knight.validMoves(context));
    },
}

let bishopTests = {
    testGetFaceWhite() {
        let bishop = new Bishop(WHITE);
        nanotest.assertEquals('♗', bishop.getFace());
    },
    testGetFaceBlack() {
        let bishop = new Bishop(BLACK);
        nanotest.assertEquals('♝', bishop.getFace());
    },
    testMovesRelative() {
        let bishop = new Bishop(WHITE);

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
        let bishop = new Bishop(WHITE);
        let context = new PathContext(fields.b1);
        
        nanotest.assertEqualsArrays([
            fields.a2,
            fields.c2,
            fields.d3,
            fields.e4,
            fields.f5,
            fields.g6,
            fields.h7
            ], bishop.validMoves(context));
    },
}



let queenTests = {
    testGetFaceWhite() {
        let queen = new Queen(WHITE);
        nanotest.assertEquals('♕', queen.getFace());
    },
    testGetFaceBlack() {
        let queen = new Queen(BLACK);
        nanotest.assertEquals('♛', queen.getFace());
    },
    testMovesRelative() {
        let queen = new Queen(WHITE);

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
        let queen = new Queen(WHITE);
        let context = new PathContext(fields.a1);

        nanotest.assertEqualsArrays([
            fields.a2,
            fields.a3,
            fields.a4,
            fields.a5,
            fields.a6,
            fields.a7,
            fields.a8,
            fields.b1,
            fields.b2,
            fields.c1,
            fields.c3,
            fields.d1,
            fields.d4,
            fields.e1,
            fields.e5,
            fields.f1,
            fields.f6,
            fields.g1,
            fields.g7,
            fields.h1,
            fields.h8
            ], queen.validMoves(context));
    },
}


let kingTests = {
    testGetFaceWhite() {
        let king = new King(WHITE);
        nanotest.assertEquals('♔', king.getFace());
    },
    testGetFaceBlack() {
        let king = new King(BLACK);
        nanotest.assertEquals('♚', king.getFace());
    },
    testMovesRelative() {
        let king = new King(WHITE);

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
        let king = new King(WHITE);
        let context = new PathContext(fields.b1);

        nanotest.assertEqualsArrays([
            fields.a1,
            fields.a2,
            fields.b2,
            fields.c1,
            fields.c2
            ], king.validMoves(context));
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