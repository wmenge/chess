
import { fields } from '/fields.js'
import { game } from '/game.js';
import { board } from '/board.js';
import { MoveContext, Move } from '/move.js';

function getField(event) {
    let data = event.target.dataset;
    return fields.getField(data.column, data.row);
}

let ui = {

    onFieldClick(e) {
        let field = getField(e);
        

        if (ui.origin == null) {

            let piece = game.getPieceAt(field);
            
            if (piece && game.hasCurrentTurn(piece.color)) {
                // why do we put piece in context?
                ui.origin = field;
                let context = new MoveContext(field, piece, game);
                board.showValidTargetFields(piece.validTargetFields(context));
            }   
        } else {
            board.clearIndicators();

            let piece = game.getPieceAt(ui.origin);
            let context = new MoveContext(ui.origin, piece, game);
            let move = new Move(field, context);

            if (move.isValid()) {
                //game.perform(move);
                move.perform();
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