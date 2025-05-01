import { getRandomNumber } from "@/app/utils/Utils";
import { Coordinate, MinesweeperBoard, MinesweeperCell, MinesweeperDifficulty, MinesweeperStatus } from "@/types";

const UNOPENED = "U";
const OPENED = "O";
const FLAGGED = "X";

const MINESWEEPER_DIMENSIONS: {[key:string]: Coordinate} = {
    'beginner': {x: 9, y: 9},
    'intermediate': {x: 16, y: 16},
    'expert': {x: 30, y: 16}
};

const MINESWEEPER_MINES: {[key:string]: number} = {
    'beginner': 10,
    'intermediate': 40,
    'expert': 99
};

function randomSelector(difficulty: MinesweeperDifficulty): Coordinate[]{
    const mines: Coordinate[] = [];
    const mineCount = MINESWEEPER_MINES[difficulty];
    const dimensions: Coordinate = MINESWEEPER_DIMENSIONS[difficulty];
    const choices = [...Array(dimensions.x * dimensions.y)].map((_, ind) => ind).filter((_, ind) => 
        ind !== 0 && ind !== dimensions.x - 1 && ind !== dimensions.x * (dimensions.y - 1) && ind !== dimensions.x * dimensions.y - 1
    );
    for(let i = 0; i < mineCount; i++){
        const newMineIndex = getRandomNumber(choices.length);
        const newMine = choices[newMineIndex];
        choices.splice(newMineIndex, 1);
        const location = {x: Math.floor(newMine % dimensions.x), y: Math.floor(newMine / dimensions.x)};
        mines.push(location);
    }
    return mines;
}

function scoreCell(cell: Coordinate, mines: Coordinate[]): number{
    let mineCount = 0;
    for(let i = 0; i < mines.length; i++){
        const mine = mines[i];
        if(mine.x == cell.x && mine.y == cell.y){
            return -1;
        }
        else{
            if(Math.abs(mine.x - cell.x) <= 1 && Math.abs(mine.y - cell.y) <= 1){
                mineCount += 1;
            }
        }
    }
    return mineCount;
}

//Init functions
export function initMinesweeperBoard(difficulty: MinesweeperDifficulty): MinesweeperBoard {
    const mines = randomSelector(difficulty);
    const grid = makeGrid(MINESWEEPER_DIMENSIONS[difficulty].x, MINESWEEPER_DIMENSIONS[difficulty].y, scoreCell, UNOPENED, mines);
    return {
        grid: grid,
        difficulty: difficulty,
        mines: mines,
        flagCount: 0,
        gameOver: false,
        cellsUnopened: getUnopenedCells(grid),
    };
}

export function getUnopenedCells(grid: MinesweeperCell[][]) : number {
    let count = 0;
    for(let i = 0; i < grid.length; i++){
        for(let j = 0; j < grid[0].length; j++){
            const cell = grid[i][j];
            if(cell.status !== OPENED){
                count++;
            }
        }
    }
    return count;
}

export function cloneMinesweeperBoard(prevState: MinesweeperBoard): MinesweeperBoard {
    const newGrid: MinesweeperCell[][] = [];
    for(let i = 0; i < prevState.grid.length; i++){
        newGrid[i] = prevState.grid[i].slice();
    }

    const newMines: Coordinate[] = [];
    for(let i = 0; i < prevState.mines.length; i++){
        newMines.push({x: prevState.mines[i].x, y: prevState.mines[i].y});
    }

    const stateCopy : MinesweeperBoard = {
        grid: newGrid,
        difficulty: prevState.difficulty,
        mines: newMines,
        flagCount: prevState.flagCount,
        gameOver: prevState.gameOver,
        cellsUnopened: prevState.cellsUnopened,
    }
    return stateCopy;
}

function makeGrid(width: number, height: number, scoreFunction: (arg0: Coordinate, arg1: Coordinate[]) => number, status: MinesweeperStatus = UNOPENED, mines: Coordinate[]) : MinesweeperCell[][]{
    return [...Array(height)].map((_, i) => [...Array(width)].map((_, j) => {
        return {
            status: status,
            value: scoreFunction({x: j, y: i}, mines),
        };
    }));
}

function revealNeighbours(board: MinesweeperBoard, target: Coordinate): MinesweeperBoard{
    const grid = board.grid;
    grid[target.y][target.y].delay = 0;
    const queue: Coordinate[] = [target];
    const visited: Coordinate[] = [];
    while(queue.length > 0){
        const v = queue.shift();
        if(v){
            visited.push(v);
            for(let i = -1; i <= 1; i++){
                for(let j = -1; j <= 1; j++){
                    const coord = {x: v.x + j, y: v.y + i};
                    if(coord.x >= 0 && coord.x < grid[0].length && coord.y >= 0 && coord.y < grid.length){
                        const filtered = visited.filter((c) => c.x == coord.x && c.y == coord.y);
                        if(filtered.length == 0){
                            const cell = grid[coord.y][coord.x];
                            if(cell.value !== -1 && cell.status !== OPENED){
                                grid[coord.y][coord.x].status = OPENED;
                                if(!cell.delay){
                                    const parentDelay = grid[v.y][v.x].delay;
                                    const distance = Math.abs(coord.y - target.y) + Math.abs(coord.x - target.x);
                                    grid[coord.y][coord.x].delay = parentDelay ? (parentDelay + 1) + (distance * 0.5) : 1;
                                }
                                if(cell.value === 0){
                                    queue.push(coord);
                                }
                            }
                        }
                    }
                }
            }
            visited.push(v);
        }
    }
    return board;
}

export function handleClick(board: MinesweeperBoard, target: Coordinate): MinesweeperBoard {
    const cell: MinesweeperCell = board.grid[target.y][target.x];
    if(cell.status !== OPENED){
        if(cell.status === FLAGGED){
            board.flagCount--;
        }
        board.grid[target.y][target.x].status = OPENED;
    };
    if(cell.value === 0){
        board = revealNeighbours(board, target);
    }
    board.cellsUnopened = getUnopenedCells(board.grid);
    return board;
}

export function showMines(board: MinesweeperBoard) : MinesweeperBoard{
    for(let i = 0; i < board.mines.length; i++){
        const mine = board.mines[i];
        board.grid[mine.y][mine.x].status = OPENED;
    }
    return board;
}

export function flagCell(board: MinesweeperBoard, target: Coordinate): MinesweeperBoard {
    const cell = board.grid[target.y][target.x];
    if(cell.status == FLAGGED){
        cell.status = UNOPENED;
        board.flagCount -= 1;
    }
    else if(cell.status == UNOPENED){
        cell.status = FLAGGED;
        board.flagCount += 1;
    }
    board.grid[target.y][target.x] = cell;
    return board;
}

export function getStatistics(difficulty: MinesweeperDifficulty, setGamesPlayed : React.Dispatch<any>, setGamesWon : React.Dispatch<any>) : void {
    const gamesPlayed = JSON.parse(localStorage.getItem(`ms-${difficulty}-played`) || "0");
    const gamesWon = JSON.parse(localStorage.getItem(`ms-${difficulty}-won`) || "0");
    setGamesPlayed(gamesPlayed);
    setGamesWon(gamesWon);
}

export function logStatistics(board: MinesweeperBoard | undefined, setGamesPlayed : React.Dispatch<any>, setGamesWon : React.Dispatch<any>) : void {

    const difficulty = board?.difficulty;
    const isGameWon = board?.mines.length == board?.cellsUnopened;
    const gamesPlayed = JSON.parse(localStorage.getItem(`ms-${difficulty}-played`) || "0") + 1;
    const gamesWon = JSON.parse(localStorage.getItem(`ms-${difficulty}-won`) || "0") + (isGameWon ? 1 : 0);

    localStorage.setItem(`ms-${difficulty}-played`, gamesPlayed);
    setGamesPlayed(gamesPlayed);
    setGamesWon(gamesWon);
    if(isGameWon){
        localStorage.setItem(`ms-${difficulty}-won`, gamesWon);
    }

}