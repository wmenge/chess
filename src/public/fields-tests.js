import nanotest from '/node_modules/@wmenge/nanotest/index.js';
import { fields, Field, relativeToAbsolute } from '/fields.js';

let relativeToAbsoluteTests = {
    testMoveUp() {
        let relativeField = new Field(0, 1);
        let origin = fields.a5;
        nanotest.assertEqualsArrays(fields.a6, relativeToAbsolute(relativeField, origin));
    },
    testMoveDown() {
        let relativeField = new Field(0, -1);
        let origin = fields.a5;
        nanotest.assertEqualsArrays(fields.a4, relativeToAbsolute(relativeField, origin));
    },
    testMoveRight() {
        let relativeField = new Field(1, 0);
        let origin = fields.a5;
        nanotest.assertEqualsArrays(fields.b5, relativeToAbsolute(relativeField, origin));
    },
    testMoveLeft() {
        let relativeField = new Field(-1, 0);
        let origin = fields.b5;
        nanotest.assertEqualsArrays(fields.a5, relativeToAbsolute(relativeField, origin));
    },
    testMoveOutOfColumnsUpperBound() {
        let relativeField = new Field(1, 0);
        let origin = fields.h5;
        nanotest.assertNull(relativeToAbsolute(relativeField, origin));
    },
    testMoveOutOfColumnsLowerBound() {
        let relativeField = new Field(-1, 0);
        let origin = fields.a1;
        nanotest.assertNull(relativeToAbsolute(relativeField, origin));
    },
    testMoveOutOfRowsUpperBound() {
        let relativeField = new Field(0, 1);
        let origin = fields.a8;
        nanotest.assertNull(relativeToAbsolute(relativeField, origin));
    },
    testMoveOutOfColumnsLowerBound() {
        let relativeField = new Field(0, -1);
        let origin = fields.a1;
        nanotest.assertNull(relativeToAbsolute(relativeField, origin));
    }
}

function runTests() {
    nanotest.run(relativeToAbsoluteTests);
}

export { runTests };