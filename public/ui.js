//import { Field } from '/pieces.js';
import { fields, PathContext } from '/pieces.js'
// to to let ui only interact with game
import { game } from '/game.js';
import { board } from '/board.js';

let ui = {

    onFieldClick(e) {
        var data = e.target.dataset;
        var field = fields.getField(data.column, data.row);

        if (ui.selectedPiece == null) {
            let piece = game.getPieceAt(field);
            if (piece && game.currentColor && piece.color == game.currentColor) {
                ui.selectedPiece = piece;
                let context = new PathContext(field, piece, game)
                board.showValidMoves(piece.validMoves(context));
            }
            return;
        }

        let context = new PathContext(game.getFieldOf(ui.selectedPiece), ui.selectedPiece, game)

        if (ui.selectedPiece.isValidMove(context, field)) {
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