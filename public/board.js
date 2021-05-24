function clearElementsByClassName(className) {
    var pieceNodes = document.getElementsByClassName(className);

    while (pieceNodes.length > 0) {
        pieceNodes[0].parentNode.removeChild(pieceNodes[0]);
    }
}

function getPieceNode(field) {
    var pieceNodes = document.getElementById("board").getElementsByClassName(`piece ${field.column} _${field.row}`);
    return (pieceNodes.length > 0) ? pieceNodes[0] : null;
}

function addElement(content, className, field) {
    var node = document.createElement("div");
    node.className = `${className} ${field.column} _${field.row}`;
    var textnode = document.createTextNode(content);
    node.appendChild(textnode);                     
    document.getElementById("board").appendChild(node);   
}

var board = {

    clear() {
        board.clearPieces();
        board.clearIndicators();
    },

    clearPieces() {
        clearElementsByClassName("piece");
    },

    clearIndicators() {
        clearElementsByClassName("indicator");
    },

    // move dom stuff to piece obj?
    // todo: rename to addpiece
    add(piece, field) {
        addElement(piece, 'piece', field);
    },

    // take piecenode as input?
    remove(field) {
        var pieceNode = getPieceNode(field);

        if (pieceNode) {
            pieceNode.parentNode.removeChild(pieceNode);
        }

        return pieceNode;
    },

    // wrong term: move is two turns by both players. Correct term is turn or ply
    move(source, target) {
        board.clearIndicators();

        var pieceNode = getPieceNode(source);
        
        if (pieceNode) {
            pieceNode.className = `piece ${target.column} _${target.row}`;
        }
    },

    capture(target) {
        var pieceNode = getPieceNode(target);
        document.getElementById("prison").appendChild(pieceNode);
    },

    showValidMoves(moves) {
        board.clearIndicators();

        moves.forEach(function(move) {
            board.showIndicator("", move);
        })
    },

    showIndicator(indicator, field) {
        let annotations = Object.keys(field.annotations).join(' ');
        console.log(annotations);
        addElement(indicator, `indicator valid ${annotations}`, field);
    }
}

export { board }