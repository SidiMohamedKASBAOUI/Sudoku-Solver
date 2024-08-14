class SudokuSolver {

  validateC(puzzleString){
    for(let i=0; i<puzzleString.length; i++){
      const invalidPattern = /^(?![1-9.]).*$/;
      if(invalidPattern.test(puzzleString[i])){return false}
      }
      return true
  }

  validate(puzzleString) {
    if (puzzleString.length === 81){return true}
    else {return false}
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let isInRow = true;
    for( let i=row*9; i<row*9 + 9; i++){
      if(value === parseInt(puzzleString[i], 10)){return false}
    }
    return isInRow; 

  }

  checkColPlacement(puzzleString, row, column, value) {

    let isInColumn = true;
    for( let i=column; i<81; i+=9){
      if(value === parseInt(puzzleString[i], 10)){return false}
    }
    return isInColumn;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let isInRegion = true; 
    let startingRowIndex = (Math.floor(row/3)*3);
    let startingColumnIndex = (Math.floor(column/3)*3);
      for(let i=startingRowIndex; i<startingRowIndex+3; i++)
      {
        for(let j=startingColumnIndex; j<startingColumnIndex+3; j++ )
        {
            let index = i*9 + j; 
            if(value === parseInt(puzzleString[index], 10)) {return false}
        }
      }
      return isInRegion;
  }

  solve(puzzleString) {
    let puzzleArray = puzzleString.split('');
    let emptyCells =[]; 
    for (let i=0; i<81; i++)
    {
      if(puzzleArray[i]==='.'){emptyCells.push(i);}
    }
    let triedNumbers = Array(emptyCells.length).fill(1);
    let currentIndex = 0;
    while(currentIndex < emptyCells.length)
    {
      let cellIndex = emptyCells[currentIndex]; 
      let row = Math.floor(cellIndex/9); 
      let column = cellIndex % 9; 
      let found = false; 
      
      for(let numberToTry = triedNumbers[currentIndex]; numberToTry<=9; numberToTry++)
      {
        if( this.checkRowPlacement(puzzleArray.join(''), row, column, numberToTry) &&
        this.checkColPlacement(puzzleArray.join(''), row, column, numberToTry) &&
        this.checkRegionPlacement(puzzleArray.join(''), row, column, numberToTry))
        {
          puzzleArray[cellIndex]=numberToTry.toString();
          found = true;
          triedNumbers[currentIndex]= numberToTry; 
          break; 
        }
      }
      if(found){currentIndex++}
      else {
        puzzleArray[cellIndex]='.';
        triedNumbers[currentIndex] = 1
        currentIndex--; 
      }
      if(currentIndex<0){return null}
    }
    return puzzleArray.join(''); 
  }
}

module.exports = SudokuSolver;

