import nanotest from '/node_modules/@wmenge/nanotest/index.js';

import { runTests } from '/pieces-tests.js';
import { runTests as fieldsTests } from '/fields-tests.js';
import { runTests as moveTests } from '/move-tests.js';
import { game } from '/game.js';
import { board } from '/board.js';
import { ui } from '/ui.js';

runTests();
fieldsTests();
moveTests();

// how to call this? and where to put it?
game.et.addEventListener("clear", () => {
    board.clear();
});

game.et.addEventListener("setup", (e) => {
    ui.updateMetadata(e.detail.game);
});

game.et.addEventListener("move", (e) => {
    board.move(e.detail.origin, e.detail.target);
});

game.et.addEventListener("move", (e) => {
    ui.updateMetadata(e.detail.game);
});

game.et.addEventListener("capture", (e) => {
    board.capture(e.detail.target);
});

game.et.addEventListener("add-piece", (e) => {
    board.add(e.detail.piece.getFace(), e.detail.field);
});

// put in own script
let scoresheet = {

	moves: [],

	clear: function() {
		this.moves = [];
	},

	addMove(piece, origin, target) {
		this.moves.push({ piece: piece, origin: origin, target: target });
		console.log(`${piece.getFace()}: ${origin.column}${origin.row} to ${target.column}${target.row}`);
	}
}

game.et.addEventListener("move", (e) => {
    scoresheet.addMove(e.detail.piece, e.detail.origin, e.detail.target);
});

ui.addEventHandlers();
game.setup();