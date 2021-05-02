import nanotest from '/node_modules/@wmenge/nanotest/index.js';

//import { Field, Pawn, Rook, Knight, Bishop, Queen, King, BLACK, WHITE } from '/pieces.js';
import { runTests } from '/pieces-tests.js';
import { game } from '/game.js';
import { board } from '/board.js';
import { ui } from '/ui.js';

runTests();

// how to call this? and where to put it?
game.et.addEventListener("clear", () => {
    board.clear();
});

game.et.addEventListener("setup", (e) => {
    ui.updateMetadata(e.detail.game);
});

game.et.addEventListener("move", (e) => {
    board.move(e.detail.piece.field, e.detail.target);
});

game.et.addEventListener("move", (e) => {
    ui.updateMetadata(e.detail.game);
});

game.et.addEventListener("capture", (e) => {
    board.capture(e.detail.target);
});

game.et.addEventListener("add-piece", (e) => {
    board.add(e.detail.getFace(), e.detail.field);
});

// put in own script
let scoresheet = {

	moves: [],

	clear: function() {
		this.moves = [];
	},

	addMove(piece, field) {
		this.moves.push({ piece: piece, field: field });
		console.log(`${piece.getFace()}: ${piece.field.column}${piece.field.row} to ${field.column}${field.row}`);
	}
}

game.et.addEventListener("move", (e) => {
    scoresheet.addMove(e.detail.piece, e.detail.target);
});

ui.addEventHandlers();
game.setup();