import { fields } from '/fields.js'
import { game } from '/game.js';
import { board } from '/board.js';
import { MoveContext } from '/pieces.js'

let ui = {

    onFieldClick(e) {
        var data = e.target.dataset;
        var field = fields.getField(data.column, data.row);

        if (ui.selectedPiece == null) {
            let piece = game.getPieceAt(field);
            if (piece && (!game.currentColor || piece.color == game.currentColor)) {
                ui.selectedPiece = piece;
                let context = new MoveContext(field, piece, game)
                board.showValidMoves(piece.validMoves(context));
            }
            return;
        }

        // Let game build up contex
        let context = new MoveContext(game.getFieldOf(ui.selectedPiece), ui.selectedPiece, game)

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