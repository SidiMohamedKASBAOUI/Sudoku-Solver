const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver;

suite('Unit Tests', () => {
    test('Logic handles a valid puzzle string of 81 characters', () => {
        const validPuzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        assert.isTrue(solver.validate(validPuzzle), 'Puzzle should be valid');
      });
    
      test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
        const invalidPuzzle = '..9..5.1.85.4....2432..x...1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        assert.isFalse(solver.validateC(invalidPuzzle), 'Puzzle should be invalid due to invalid character');
      });
    
      test('Logic handles a puzzle string that is not 81 characters in length', () => {
        const shortPuzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.';
        assert.isFalse(solver.validate(shortPuzzle), 'Puzzle should be invalid due to incorrect length');
      });
    
      test('Logic handles a valid row placement', () => {
        const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        const isValid = solver.checkRowPlacement(puzzle, 0, 1, '7'); // Place 4 in row 0, column 2
        assert.isTrue(isValid, 'Row placement should be valid');
      });
    
      test('Logic handles an invalid row placement', () => {
        const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        const isValid = solver.checkRowPlacement(puzzle, 0, 1, 5); // Place 5 in row 0, column 2
        assert.isFalse(isValid, 'Row placement should be invalid');
      });
    
      test('Logic handles a valid column placement', () => {
        const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        const isValid = solver.checkColPlacement(puzzle, 0, 1, '7'); // Place 2 in column 2
        assert.isTrue(isValid, 'Column placement should be valid');
      });
    
      test('Logic handles an invalid column placement', () => {
        const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        const isValid = solver.checkColPlacement(puzzle, 0, 1, 9); // Place 9 in column 2
        assert.isFalse(isValid, 'Column placement should be invalid');
      });
    
      test('Logic handles a valid region (3x3 grid) placement', () => {
        const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        const isValid = solver.checkRegionPlacement(puzzle, 0, 1, 1); // Place 1 in region containing row 0, column 2
        assert.isTrue(isValid, 'Region placement should be valid');
      });
    
      test('Logic handles an invalid region (3x3 grid) placement', () => {
        const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        const isValid = solver.checkRegionPlacement(puzzle, 0, 1, 9); // Place 9 in region containing row 0, column 2
        assert.isFalse(isValid, 'Region placement should be invalid');
      });
    
      test('Valid puzzle strings pass the solver', () => {
        const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        const solution = solver.solve(puzzle);
        assert.isString(solution, 'Solution should be a string');
        assert.notInclude(solution, '.', 'Solution should not contain any empty cells');
      });
    
      test('Invalid puzzle strings fail the solver', () => {
        const puzzle = '..9..5.1.85.4....2x32......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.';
        const solution = solver.validateC(puzzle);
        assert.isFalse(solution, 'Solution should be null for invalid puzzles');
      });
    
      test('Solver returns the expected solution for an incomplete puzzle', () => {
        const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        const expectedSolution = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
        const solution = solver.solve(puzzle);
        assert.strictEqual(solution, expectedSolution, 'Solver should return the correct solution');
      });
});
