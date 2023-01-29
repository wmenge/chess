import nanotest from '/node_modules/@wmenge/nanotest/index.js';

import { game } from '/game.js';
import { fields, Field } from '/fields.js';
import { Pawn, Rook, Knight, Bishop, Queen, King, BLACK, WHITE } from '/pieces.js';
import { MoveContext, Move } from '/move.js';

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
        nanotest.assertEqualsArrays([new Field(0, 1)], pawn.validTargetFieldsRelative());
    },
    testMovesRelativeBlack() {
        let pawn = new Pawn(BLACK);
        nanotest.assertEqualsArrays([new Field(0, -1)], pawn.validTargetFieldsRelative());
    },
    /*testPawnWithoutFieldHasNovalidTargetFields() {
        let pawn = new Pawn(BLACK);
        nanotest.assertNull(pawn.validTargetFields());
    },*/
    testBlackPawnWithFieldHasvalidTargetFields() {
        let pawn = new Pawn(BLACK);
        let context = new MoveContext(fields.a7);
        nanotest.assertEqualsArrays([fields.a5, fields.a6], pawn.validTargetFields(context));
    },
    testWhitePawnWithFieldHasvalidTargetFields() {
        let pawn = new Pawn(WHITE);
        let context = new MoveContext(fields.d2);
        nanotest.assertEqualsArrays([fields.d3, fields.d4], pawn.validTargetFields(context));
    },
    testWhitePawnOnInitialPositionHasTwoMoves() {
        let pawn = new Pawn(WHITE);
        let context = new MoveContext(fields.a2);
        nanotest.assertEqualsArrays([new Field(0, 1), new Field(0, 2)], pawn.validTargetFieldsRelative(context));
    },
    testWhitePawnOnNonInitialStateHasOneMove() {
        let pawn = new Pawn(WHITE);
        let context = new MoveContext(fields.a3);
        nanotest.assertEqualsArrays([new Field(0, 1)], pawn.validTargetFieldsRelative(context));
    },
    testBlackPawnOnInitialPositionHasTwoMoves() {
        let pawn = new Pawn(BLACK);
        let context = new MoveContext(fields.a7);
        nanotest.assertEqualsArrays([new Field(0, -1), new Field(0, -2)], pawn.validTargetFieldsRelative(context));
    },
    testBlackPawnOnNonInitialStateHasOneMove() {
        let pawn = new Pawn(BLACK);
        let context = new MoveContext(fields.a6);
        nanotest.assertEqualsArrays([new Field(0, -1)], pawn.validTargetFieldsRelative(context));
    },
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
            ], rook.validTargetFieldsRelative());
    },
    testMoves() {
        let rook = new Rook(WHITE);
        let field = fields.a1
        let context = new MoveContext(field);

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
            ], rook.validTargetFields(context));
    },
    testCollision() {
        let pawn = new Pawn(WHITE);
        let rook = new Rook(WHITE);
        let knight = new Knight(WHITE);

        game.clear();
        game.add(pawn, fields.a2);
        game.add(rook, fields.a1);
        game.add(knight, fields.b1);

        let context = new MoveContext(fields.a1, rook, game);

        // rook cannot move as it is enclosed by a pawn and a knight
        nanotest.assertEqualsArrays([], rook.validTargetFields(context));
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
        ], knight.validTargetFieldsRelative());
    },
    testMoves() {
        let knight = new Knight(WHITE);
        let context = new MoveContext(fields.b1);
        nanotest.assertEqualsArrays([
            fields.a3,
            fields.c3,
            fields.d2
        ], knight.validTargetFields(context));
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
            ], bishop.validTargetFieldsRelative());
    },
    testMoves() {
        let bishop = new Bishop(WHITE);
        let context = new MoveContext(fields.b1);
        
        nanotest.assertEqualsArrays([
            fields.a2,
            fields.c2,
            fields.d3,
            fields.e4,
            fields.f5,
            fields.g6,
            fields.h7
            ], bishop.validTargetFields(context));
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
            ], queen.validTargetFieldsRelative());
    },
    testMoves() {
        let queen = new Queen(WHITE);
        let context = new MoveContext(fields.a1);

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
            ], queen.validTargetFields(context));
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
            ], king.validTargetFieldsRelative());
    },
    testMoves() {
        let king = new King(WHITE);
        let context = new MoveContext(fields.b1);

        nanotest.assertEqualsArrays([
            fields.a1,
            fields.a2,
            fields.b2,
            fields.c1,
            fields.c2
            ], king.validTargetFields(context));
    },
}

let kingSidecastlingTests = {
    testCannotPerformKingSideCastlingWithouContext() {
        let king = new King(WHITE);
        nanotest.assertTrue(!king.canPerformKingSideCastling());
    },
    testCannotPerformWhiteKingSideCastlingWithLimitedContext() {
        let king = new King(WHITE);
        let context = new MoveContext(fields.e1);
        nanotest.assertTrue(!king.canPerformKingSideCastling());
    },
    testCannotPerformWhiteKingSideCastlingOnNonInitialPosition() {
        let king = new King(WHITE);
        let context = new MoveContext(fields.e2, king);
        nanotest.assertTrue(!king.canPerformKingSideCastling(context));
    },
    testCanPerformWhiteKingSideCastlingContext() {
        game.clear();

        let king = new King(WHITE);
        let rook = new Rook(WHITE);

        game.add(rook, fields.h1);

        let context = new MoveContext(fields.e1, king, game);
        nanotest.assertTrue(king.canPerformKingSideCastling(context));
    },
    testCanPerformBlackKingSideCastlingContext() {

        game.clear();

        let king = new King(BLACK);
        let rook = new Rook(BLACK);

        game.add(rook, fields.a8);

        let context = new MoveContext(fields.d8, king, game);
        nanotest.assertTrue(king.canPerformKingSideCastling(context));
    },
    testWhiteKingMovesIncludesKingSideCastling() {
        game.clear();

        let king = new King(WHITE);
        let rook = new Rook(WHITE);

        game.add(king, fields.e1);
        game.add(rook, fields.h1);

        let context = new MoveContext(fields.e1, king, game);

        nanotest.assertEqualsArrays([
            new Field(-1, -1),
            new Field(-1, 0),
            new Field(-1, 1),
            new Field(0, -1),
            new Field(0, 1),        
            new Field(1, -1),
            new Field(1, 0),
            new Field(1, 1),
            new Field(2, 0, { kingsSideCastle: true })
            ], king.validTargetFieldsRelative(context));
    },
    testBlackKingMovesIncludesKingSideCastling() {
        game.clear();

        let king = new King(BLACK);
        let rook = new Rook(BLACK);

        game.add(king, fields.d8);
        game.add(rook, fields.a8);

        let context = new MoveContext(fields.d8, king, game);

        nanotest.assertEqualsArrays([
            new Field(-2, 0, { kingsSideCastle: true }),
            new Field(-1, -1),
            new Field(-1, 0),
            new Field(-1, 1),
            new Field(0, -1),
            new Field(0, 1),        
            new Field(1, -1),
            new Field(1, 0),
            new Field(1, 1)
            ], king.validTargetFieldsRelative(context));
    },
}

let queenSidecastlingTests = {
    testCannotPerformQueenSideCastlingWithouContext() {
        let king = new King(WHITE);
        nanotest.assertTrue(!king.canPerformQueenSideCastling());
    },
    testCannotPerformWhiteQueenSideCastlingWithLimitedContext() {
        let king = new King(WHITE);
        let context = new MoveContext(fields.e1);
        nanotest.assertTrue(!king.canPerformQueenSideCastling());
    },
    testCannotPerformWhiteQueenSideCastlingOnNonInitialPosition() {
        let king = new King(WHITE);
        let context = new MoveContext(fields.e2, king);
        nanotest.assertTrue(!king.canPerformQueenSideCastling(context));
    },
    testCanPerformWhiteQueenSideCastlingContext() {
        game.clear();

        let king = new King(WHITE);
        let rook = new Rook(WHITE);

        game.add(rook, fields.a1);

        let context = new MoveContext(fields.e1, king, game);
        nanotest.assertTrue(king.canPerformQueenSideCastling(context));
    },
    testCanPerformBlackQueenSideCastlingContext() {

        game.clear();

        let king = new King(BLACK);
        let rook = new Rook(BLACK);

        game.add(rook, fields.h8);

        let context = new MoveContext(fields.d8, king, game);
        nanotest.assertTrue(king.canPerformQueenSideCastling(context));
    },
    testWhiteKingMovesIncludesQueenSideCastling() {
        game.clear();

        let king = new King(WHITE);
        let rook = new Rook(WHITE);

        game.add(king, fields.e1);
        game.add(rook, fields.a1);

        let context = new MoveContext(fields.e1, king, game);

        nanotest.assertEqualsArrays([
            new Field(-2, 0, { queenSideCastle: true }),
            new Field(-1, -1),
            new Field(-1, 0),
            new Field(-1, 1),
            new Field(0, -1),
            new Field(0, 1),        
            new Field(1, -1),
            new Field(1, 0),
            new Field(1, 1),
            ], king.validTargetFieldsRelative(context));
    },
    testBlackKingMovesIncludesQueenSideCastling() {
        game.clear();

        let king = new King(BLACK);
        let rook = new Rook(BLACK);

        game.add(king, fields.d8);
        game.add(rook, fields.h8);

        let context = new MoveContext(fields.d8, king, game);

        nanotest.assertEqualsArrays([
            new Field(-1, -1),
            new Field(-1, 0),
            new Field(-1, 1),
            new Field(0, -1),
            new Field(0, 1),        
            new Field(1, -1),
            new Field(1, 0),
            new Field(1, 1),
            new Field(2, 0, { queenSideCastle: true })
            ], king.validTargetFieldsRelative(context));
    },
}

let captureTests = {
    testRookCapturesPawn() {
        let pawn = new Pawn(BLACK);
        let rook = new Rook(WHITE);
        let knight = new Knight(WHITE);

        game.clear();
        game.add(pawn, fields.a2);
        game.add(rook, fields.a1);
        game.add(knight, fields.b1);

        let context = new MoveContext(fields.a1, rook, game);

        // rook can capture pawn
        nanotest.assertEqualsArrays([new Field('a', 2, { capture: true })], rook.validTargetFields(context));
    }
}

function runTests() {
    nanotest.run(pawnTests);
    nanotest.run(rookTests);
    nanotest.run(knightTests);
    nanotest.run(bishopTests);
    nanotest.run(queenTests);
    nanotest.run(kingTests);
    nanotest.run(kingSidecastlingTests);
    nanotest.run(queenSidecastlingTests);
    nanotest.run(captureTests);
}

export { runTests };