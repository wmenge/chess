function compareFields(a, b) {
    if (typeof a.column == 'number') {
        return a.column - b.column || a.row - b.row;    
    } else {
        return a.column.localeCompare(b.column) || a.row - b.row;    
    }
}

// correct names are rank/file!
// never create fields manually, because we cannot
// overload == in javascript atm. Always use predefined fields
// make distinction between relative, absolute fields!
function Field(column, row, annotations = {}) {
    this.column = column;
    this.row = parseInt(row);
    this.annotations = annotations; // annotations should belong to a move (origin/target) object
    // annotations should be a list of strings

    this.equals = function(field) {
        return this.column == field.column && this.row == field.row;
    },

    this.toString = function() {
        return `${this.column}${this.row}`
    }
}

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

let fields = new PredefineFields();

function relativeToAbsolute(relativeField, origin) {
    let targetColumnIndex = 
    columns.indexOf(origin.column) + 
    relativeField.column;
    let targetRowIndex = origin.row + relativeField.row;
    if (targetColumnIndex < 0 || targetColumnIndex >= columns.length || targetRowIndex < 1 || targetRowIndex > 8) return null;

    let result = new Field(columns[targetColumnIndex], targetRowIndex);
    result.annotations = relativeField.annotations;
    return result;
     //fields[`${columns[targetColumnIndex]}${targetRowIndex}`];
}

// refactor out relative to absolute (provide absolute to begin with)
function collision(game, target, origin) {
    return (game && origin) ? game.getPieceAt(relativeToAbsolute(target, origin)) : false;
}

export { fields, Field, relativeToAbsolute, compareFields, collision }