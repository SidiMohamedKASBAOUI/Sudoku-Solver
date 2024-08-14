const SudokuSolver = require('./sudoku-solver')

// Initialize the SudokuSolver
const solver = new SudokuSolver();

// Define a sample Sudoku puzzle
const puzzleString = "7...6.1.21..27..534.58...7.9.....5....2..........43.......5......8....3.2......47";
console.log(puzzleString.length); 


// Validate the puzzle
if (!solver.validate(puzzleString)) {
  console.log("Invalid puzzle string. It should have exactly 81 characters.");
  process.exit(1);
}

// Solve the puzzle
const solvedPuzzle = solver.solve(puzzleString);

// Check if the puzzle was solved
if (solvedPuzzle) {
  console.log("Solved Puzzle:");
  console.log(solvedPuzzle);
} else {
  console.log("The puzzle could not be solved.");
}
