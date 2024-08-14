'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      console.log(req.body);
      const coordinatePattern = /^[A-I][1-9]$/;
      const valuePattern = /^[1-9]$/;
      if(!req.body.puzzle || !req.body.coordinate || !req.body.value){return res.json({ error: 'Required field(s) missing' });}

      if(!solver.validate(req.body.puzzle)) {return res.json({ error: 'Expected puzzle to be 81 characters long' });}
      
      if(!coordinatePattern.test(req.body.coordinate)){return res.json({"error": "Invalid coordinate"});}
      else{
        if(!valuePattern.test(req.body.value)){return res.json({"error": "Invalid value"})}
        else{
          let row; 
          const coordinateNumber = parseInt(req.body.coordinate[1], 10)-1;
          switch (req.body.coordinate[0]) {
            case 'A':  row = 0; break;
            case 'B':  row = 1; break;
            case 'C':  row = 2; break;
            case 'D':  row = 3; break;
            case 'E':  row = 4; break;
            case 'F':  row = 5; break;
            case 'G':  row = 6; break;
            case 'H':  row = 7; break;
          }
          let column = coordinateNumber ; 
          let conflict = []; 
          let a=1, b=1;
          if(req.body.value == req.body.puzzle[row*9+column]){return res.json({"valid": true})}
          for(let i=0; i<req.body.puzzle.length; i++){
            const invalidPattern = /^(?![1-9.]).*$/;
            if(invalidPattern.test(req.body.puzzle[i])){return res.json({ error: 'Invalid characters in puzzle' })}
            }
          if(!solver.checkRowPlacement(req.body.puzzle, row, column, parseInt(req.body.value, 10))){
            conflict.push("row");b=0; console.log("Conflict in row");
          }
          if(!solver.checkColPlacement(req.body.puzzle, row, column, parseInt(req.body.value, 10))){
            conflict.push("column");b=0; console.log("Conflict in column");
          } 
          if(!solver.checkRegionPlacement(req.body.puzzle, row, column, parseInt(req.body.value, 10))){
            conflict.push("region");b=0; console.log("Conflict in Region")}
          console.log(a,b);
          if(a*b === 0)
            {return res.json({"valid" : false, "conflict":conflict})}
            else{return res.json({"valid": true})}
        }
      }

    });
    
  app.route('/api/solve')
    .post((req, res) => {
      if(!req.body.puzzle){return res.json({ error: 'Required field missing' })}

      const solvedPuzzle = solver.solve(req.body.puzzle);
      if(!solver.validate(req.body.puzzle)) {return res.json({ error: 'Expected puzzle to be 81 characters long' });}

      for(let i=0; i<req.body.puzzle.length; i++){
        const invalidPattern = /^(?![1-9.]).*$/;
        if(invalidPattern.test(req.body.puzzle[i])){return res.json({ error: 'Invalid characters in puzzle' })}
        }

      if (solvedPuzzle) {
          console.log("Solved Puzzle:");
          console.log(solvedPuzzle);
          return res.json({solution: solvedPuzzle})
    } else {
          return res.json({ error: 'Puzzle cannot be solved' });
            }

    });
};
