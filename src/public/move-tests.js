import nanotest from '/node_modules/@wmenge/nanotest/index.js';

import { game } from '/game.js';
import { fields, Field } from '/fields.js';
import { Pawn, Rook, Knight, Bishop, Queen, King, BLACK, WHITE } from '/pieces.js';
import { MoveContext, Move } from '/move.js';

let moveTests = {
    testIsValidMove() {
        let pawn = new Pawn(WHITE);
        let context = new MoveContext(fields.d2, pawn);
        let move = new Move(fields.d3, context);
        nanotest.assertTrue(move.isValid());
    },
    testIsNotValidMove() {
        let pawn = new Pawn(WHITE);
        let context = new MoveContext(fields.d2, pawn);
        let move = new Move(fields.c3, context);
        nanotest.assertTrue(!move.isValid());
    },
    testPawnCapturesDiagonal() {
        let whitePawn = new Pawn(WHITE);
        let blackPawn = new Rook(BLACK);
    
        game.clear();
        game.add(whitePawn, fields.a2);
        game.add(blackPawn, fields.b3);
        
        let context = new MoveContext(fields.a2, whitePawn, game);
        let move = new Move(fields.b3, context);

        // white pawn can capture black pawn
        nanotest.assertTrue(move.isValid());
    },
    testPawnDoesNotCaptureStraight() {
        let whitePawn = new Pawn(WHITE);
        let blackPawn = new Rook(BLACK);
    
        game.clear();
        game.add(whitePawn, fields.a2);
        game.add(blackPawn, fields.a3);
        
        let context = new MoveContext(fields.a2, whitePawn, game);
        let move = new Move(fields.a3, context);

        // white pawn can not capture black pawn
        nanotest.assertTrue(!move.isValid());
    }
}

function runTests() {
    nanotest.run(moveTests);
}

export { runTests };