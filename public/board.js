var board = {

    clear() {
        board.clearPieces();
        board.clearIndicators();
    },

    clearPieces() {
        board.clearElementsByClassName("piece");
    },

    clearIndicators() {
        board.clearElementsByClassName("indicator");
    },

    // helper method, private
    clearElementsByClassName(className) {
        var pieceNodes = document.getElementsByClassName(className);

        while (pieceNodes.length > 0) {
            pieceNodes[0].parentNode.removeChild(pieceNodes[0]);
        }
    },

    // move dom stuff to piece obj?
    // todo: rename to addpiece
    add(piece, field) {
        board.addElement(piece, 'piece', field);
    },

    // take piecenode as input?
    remove(field) {
        var pieceNode = board.getPieceNode(field);

        if (pieceNode) {
            pieceNode.parentNode.removeChild(pieceNode);
        }

        return pieceNode;
    },

    // wrong term: move is two turns by both players. Correct term is turn or ply
    move(source, target) {
        board.clearIndicators();

        var pieceNode = board.getPieceNode(source);
        
        if (pieceNode) {
            pieceNode.className = `piece ${target.column} _${target.row}`;
        }
    },

    capture(pieceNode) {
        document.getElementById("prison").appendChild(pieceNode);
    },

    getPieceNode(field) {
        var pieceNodes = document.getElementById("board").getElementsByClassName(`piece ${field.column} _${field.row}`);
        return (pieceNodes.length > 0) ? pieceNodes[0] : null;
    },

    showValidMoves(moves) {
        board.clearIndicators();

        moves.forEach(function(move) {
            board.showIndicator("x", move);
        })
    },

    showIndicator(indicator, field) {
        board.addElement(indicator, 'indicator', field);
    },

    addElement(content, className, field) {
        var node = document.createElement("div");
        node.className = `${className} ${field.column} _${field.row}`;
        var textnode = document.createTextNode(content);
        node.appendChild(textnode);                     
        document.getElementById("board").appendChild(node);   
    }

}

export { board }