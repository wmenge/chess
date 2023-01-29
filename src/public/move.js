function MoveContext(origin = null, piece = null, game = null) { //, calculateAttackAnnotation = true) {
    this.origin = origin;
    this.piece = piece;
    this.game = game;
    //this.calculateAttackAnnotation = calculateAttackAnnotation;
}

function Move(target, context) {//, annotations = {}) {
	this.target = target;
	this.context = context;
	
	///`${piece.getFace()}: ${origin.column}${origin.row} to ${target.column}${target.row}`
	this.isValid = function() {
		return this.context.piece.validTargetFields(this.context).find(m => m.equals(this.target));
	};

	this.perform = function() {

		let game = this.context.game;

        if (!this.isValid()) {
            console.error("Illegal move: %o to %o", this.context.origin, target);
            return false;  
        }

        if (game.getPieceAt(target)) {
            game.capture(target);
        }

        
        game.perform(this);

// game.move()?
        

        game.toggleTurn();

        // this should be in separeate method of special case move object
        /*let moveContext = new MoveContext(origin, piece, this);
        if (piece instanceof King && piece.color == WHITE && piece.canPerformKingSideCastling(moveContext) && target.equals(relativeToAbsolute(piece.kingSideCastleMove(moveContext)[0],origin))) {
            var rook = this.getPieceAt(fields.h1);
            delete this.pieces[fields.h1.toString()];
            this.pieces[fields.f1.toString()] = rook;
            this.et.dispatchEvent(new CustomEvent("move", { detail: { origin: fields.h1, piece: rook, target: fields.f1, game: this }}));   
        }

        if (piece instanceof King && piece.color == BLACK && piece.canPerformKingSideCastling(moveContext) && target.equals(relativeToAbsolute(piece.kingSideCastleMove(moveContext)[0],origin))) {
            var rook = this.getPieceAt(fields.a8);
            delete this.pieces[fields.a8.toString()];
            this.pieces[fields.c8.toString()] = rook;
            this.et.dispatchEvent(new CustomEvent("move", { detail: { origin: fields.a8, piece: rook, target: fields.c8, game: this }}));   
        }

        if (piece instanceof King && piece.color == WHITE && piece.canPerformQueenSideCastling(moveContext) && target.equals(relativeToAbsolute(piece.queenSideCastleMove(moveContext)[0],origin))) {
            var rook = this.getPieceAt(fields.a1);
            delete this.pieces[fields.a1.toString()];
            this.pieces[fields.d1.toString()] = rook;
            this.et.dispatchEvent(new CustomEvent("move", { detail: { origin: fields.a1, piece: rook, target: fields.d1, game: this }}));   
        }

        if (piece instanceof King && piece.color == BLACK && piece.canPerformQueenSideCastling(moveContext) && target.equals(relativeToAbsolute(piece.queenSideCastleMove(moveContext)[0],origin))) {
            var rook = this.getPieceAt(fields.h8);
            delete this.pieces[fields.h8.toString()];
            this.pieces[fields.e8.toString()] = rook;
            this.et.dispatchEvent(new CustomEvent("move", { detail: { origin: fields.h8, piece: rook, target: fields.e8, game: this }}));   
        }*/

        game.et.dispatchEvent(new CustomEvent("move", { detail: { origin: this.context.origin, piece: this.context.piece, target: this.target, game: game }}));

        // allows UI to update with css transitions
        // when called with await
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, 500);
        });
	}
}


export { MoveContext, Move }