
import { fields } from '/fields.js'
import { game } from '/game.js';
import { board } from '/board.js';
import { MoveContext } from '/pieces.js'

function getField(event) {
    let data = event.target.dataset;
    return fields.getField(data.column, data.row);
}

let ui = {

    onFieldClick(e) {
        let field = getField(e);

        if (ui.origin == null) {
            ui.origin = field;
            let piece = game.getPieceAt(field);
            if (piece && game.hasCurrentTurn(piece.color)) {
                // why do we put piece in context?
                let moveContext = new MoveContext(field, piece, game);
                board.showValidMoves(piece.validMoves(moveContext));
            }   
        } else {
            board.clearIndicators();
            if (game.isValidMove(ui.origin, field)) {
                game.move(ui.origin, field);
            }

            ui.origin = null;
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