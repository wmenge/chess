import { Field } from '/pieces.js';
// to to let ui only interact with game
import { game } from '/game.js';
import { board } from '/board.js';

let ui = {

    onFieldClick(e) {
        var data = e.target.dataset;
        var field = new Field(data.column, data.row);

        if (ui.selectedPiece == null) {
            let piece = game.getPieceAt(field);
            if (piece && game.currentColor && piece.color == game.currentColor) {
                ui.selectedPiece = piece;
                board.showValidMoves(piece.validMoves());
            }
        } else if (ui.selectedPiece.isValidMove(field)) {
            // move validattion to game.move!
            game.move(ui.selectedPiece, field);
            ui.selectedPiece = null;
        } else {
            ui.selectedPiece = null;
            board.clearIndicators();
        }

    },

    addEventHandlers() {
        var elements = document.getElementsByClassName("field");

        Array.from(elements).forEach(function(element) {
          element.addEventListener('click', ui.onFieldClick);
        });
    },

    updateMetadata(game) {
        //console.log(game.currentColor);
        document.getElementById("metadata").innerHTML = game.currentColor;
    }
}

export { ui };