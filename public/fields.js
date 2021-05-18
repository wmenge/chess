function compareFields(a, b) {
    if (typeof a.column == 'number') {
        return a.column - b.column || a.row - b.row;    
    } else {
        return a.column.localeCompare(b.column) || a.row - b.row;    
    }
}

// move to field.js?
// correct names are rank/file!
// create shorthands: a1 = new Field("a", 1)
// never create fields manually, because we cannot
// overload == in javascript atm. Always use predefined fields
// make distinction between relative, absolute fields!
function Field(column, row) {
    this.column = column;
    this.row = parseInt(row);

    this.equals = function(field) {
        return this.column == field.column && this.row == field.row;
    }
}

// this is about fields not pieces
let columns = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h' ];

function PredefineFields() {
    columns.forEach(c => {
        for (let i = 0; i < 8 ; i++) {
            this[`${c}${i+1}`] = (new Field(c, i+1));
        }
    });

    this.getField = function(column, row) {
        return this[`${column}${row}`]
    };

}

// move fields to game?
let fields = new PredefineFields();

// this is about fields not pieces
// how to test?
function relativeToAbsolute(relativeField, origin) {
    let targetColumnIndex = columns.indexOf(origin.column) + relativeField.column;
    let targetRowIndex = origin.row + relativeField.row;
    if (targetColumnIndex < 0 || targetColumnIndex >= columns.length || targetRowIndex < 1 || targetRowIndex > 8) return null;

    return fields[`${columns[targetColumnIndex]}${targetRowIndex}`];
}

// this is about fields not pieces
// move to game?
// refactor out relative to absolute (provide absolute to begin with)
function collision(game, target, origin) {
    return (game && origin) ? game.getPieceAt(relativeToAbsolute(target, origin)) : false;
}


export { fields, Field, relativeToAbsolute, compareFields, collision }