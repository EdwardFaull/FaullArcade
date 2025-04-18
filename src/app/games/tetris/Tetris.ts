import { getRandomNumber } from "@/app/utils/Utils";
import { Coord, TetrisBoard } from "@/types";
import { isPageStatic } from "next/dist/build/utils";
import { Cookies } from "react-cookie";
import { MILLIS_IN_A_DAY } from "../countdown/Countdown";

export const TETRIS_BOARD_WIDTH: number = 10;
export const TETRIS_BOARD_HEIGHT: number = 20;

export const TETRONIMO_I: number[][] = [[1, 1, 1, 1]];
export const TETRONIMO_J: number[][] = [[1, 0, 0], [1, 1, 1]];
export const TETRONIMO_L: number[][] = [[0, 0, 1], [1, 1, 1]];
export const TETRONIMO_O: number[][] = [[1, 1], [1, 1]];
export const TETRONIMO_S: number[][] = [[0, 1, 1], [1, 1, 0]];
export const TETRONIMO_T: number[][] = [[0, 1, 0], [1, 1, 1]];
export const TETRONIMO_Z: number[][] = [[1, 1, 0], [0, 1, 1]];

export const TETRIS_LINE_MULTIPLIER: number[] = [4, 10, 30, 120];

export const TETRIS_COLOURS: string[] = ["yellow", "orange", "red", "magenta", "violet", "blue", "cyan", "green"];

const TETRIS_LEVEL_SCORE: number[] = [0, 1, 3, 5, 8];


export const TETRONIMOS : { [id: string]: number[][] } = {
    "I": TETRONIMO_I, 
    "J": TETRONIMO_J, 
    "L": TETRONIMO_L, 
    "O": TETRONIMO_O, 
    "S": TETRONIMO_S, 
    "T": TETRONIMO_T, 
    "Z": TETRONIMO_Z
};

export const TETRONIMOS_COLOURS: string[] = [];

//Init functions
export function initTetrisBoard(width: number, height: number, level: number): TetrisBoard {
    return {
        grid: makeGrid(width, height),
        pieceType: "",
        pieceCoords: [0, 0],
        pieceColour: 1,
        pieceShape: [],
        shiftDown: -1,
        score: 0,
        colours: [],
        guideBlocks: [],
        level: level,
        levelScore: 0,
        gameOver: false,
    };
}

export function cloneTetrisBoard(prevState: TetrisBoard): TetrisBoard {
    const newGrid: number[][] = [];
    for(let i = 0; i < prevState.grid.length; i++){
        newGrid[i] = prevState.grid[i].slice();
    }
    const stateCopy : TetrisBoard = {
        grid: newGrid,
        pieceType: prevState.pieceType,
        pieceCoords: [prevState.pieceCoords[0], prevState.pieceCoords[1]],
        pieceColour: prevState.pieceColour,
        pieceShape: prevState.pieceShape,
        shiftDown: prevState.shiftDown,
        score: prevState.score,
        colours: prevState.colours.slice(),
        guideBlocks: prevState.guideBlocks.slice(),
        level: prevState.level,
        levelScore: prevState.levelScore,
        gameOver: prevState.gameOver,
    }
    return stateCopy;
}

function makeGrid(width: number, height: number, value: number = 0) : number[][]{
    return [...Array(height)].map(() => Array(width).fill(value));
}

const tracker : number[] = [];

function selectTetronimo(): string {
    const index = getRandomNumber(Object.keys(TETRONIMOS).length);
    tracker.push(index);
    return Object.keys(TETRONIMOS)[index];
}

function hasFallingPieces(board: TetrisBoard): boolean {
    return board.pieceType.length != 0;
}

function cloneShape(shape: number[][]): number[][] {
    const shapeClone: number[][] = [];
    for(let i = 0; i < shape.length; i++){
        shapeClone[i] = shape[i].slice();
    }
    return shapeClone;
}

function liftShape(board: TetrisBoard): TetrisBoard{
    const offset = board.pieceCoords;
    const shape = board.pieceShape;
    for(let i = 0; i < shape.length; i++){
        for(let j = 0; j < shape[0].length; j++){
            if(shape[i][j] == 1){
                board.grid[i + offset[0]][j + offset[1]] = 0;
            }
        }
    }
    return board;
}

function placeShape(board: TetrisBoard): TetrisBoard{
    const offset = board.pieceCoords;
    const shape = board.pieceShape;
    for(let i = 0; i < shape.length; i++){
        for(let j = 0; j < shape[0].length; j++){
            if(shape[i][j] == 1){
                board.grid[i + offset[0]][j + offset[1]] = board.pieceColour;
            }
        }
    }
    board = populateGuideArray(board);
    return board;
}

function canMoveShape(board: TetrisBoard, newShape: number[][], newLocation: number[]): boolean {
    for(let i = 0; i < newShape.length; i++){
        for(let j = 0; j < newShape[0].length; j++){
            if(newShape[i][j] == 1){
                if(board.grid[i + newLocation[0]] === undefined){
                    return false;
                }
                const boardCell = board.grid[i + newLocation[0]][j + newLocation[1]];
                if(boardCell != 0 && boardCell != board.pieceColour){
                    return false;
                }
            }
        }
    }
    return true;
}

//Control functions
export function moveShape(board: TetrisBoard, direction: boolean): TetrisBoard {
    if(board.pieceType.length == 0){
        return board;
    }

    const translation : number = direction ? 1 : -1;
    const newCoords = [board.pieceCoords[0], board.pieceCoords[1] + translation];
    const offset = board.pieceCoords;
    const shape = board.pieceShape;

    //ignore if off the board
    if(translation == -1 && offset[1] == 0 || translation == 1 && offset[1] + shape[0].length == board.grid[0].length) {
        return board;
    }
    if(!canMoveShape(board, shape, newCoords)){
        return board;
    }
    board = liftShape(board);
    board.pieceCoords = newCoords;
    board = placeShape(board);
    return board;
}

export function skipShape(board: TetrisBoard): TetrisBoard {
    if(board.pieceType.length == 0 || board.shiftDown >= 0 || isPieceDead(board)){
        return board;
    }

    let translation : number = 0;
    while(translation + board.pieceCoords[0] + board.pieceShape.length < board.grid.length && 
        canMoveShape(board, board.pieceShape, [board.pieceCoords[0] + translation, board.pieceCoords[1]])){
        translation++;
    }
    const newCoords = [board.pieceCoords[0] + translation, board.pieceCoords[1]];

    if(!canMoveShape(board, board.pieceShape, newCoords)){
        newCoords[0]--;
    }
    board = liftShape(board);
    board.pieceCoords = newCoords;
    board = placeShape(board);
    board = scoreDrop(board, translation);
    return board;
}

export function rotateShape(board: TetrisBoard): TetrisBoard {
    if(board.pieceType.length == 0){
        return board;
    }

    const shapeClone = cloneShape(board.pieceShape);
    const rotatedShape = shapeClone[0].map((_, index) => shapeClone.map(row => row[index]).reverse());

    if(canMoveShape(board, rotatedShape, board.pieceCoords)){
        board = liftShape(board);
        board.pieceShape = rotatedShape;
        board = placeShape(board);
    }

    return board;
}

//Gamestate functions
export function placeTetronimo(board: TetrisBoard): TetrisBoard {
    if(hasFallingPieces(board)){
        return board;
    }

    const pieceType = selectTetronimo();
    const piece = TETRONIMOS[pieceType];
    const colour = board.pieceColour;

    const pieceHeight = piece.length;
    const pieceWidth = piece[0].length;

    const allowedStartIndices = [];
    for(let col = 0; col < board.grid[0].length - pieceWidth + 1; col++){
        if(canMoveShape(board, piece, [0, col])){
            allowedStartIndices.push(col);
        }
    }
    if(allowedStartIndices.length == 0){
        board.gameOver = true;
        return board;
    }
    const startIndex = allowedStartIndices[getRandomNumber(allowedStartIndices.length)];
    board.pieceType = pieceType;
    board.pieceColour = colour;
    board.pieceShape = cloneShape(piece);
    board.pieceCoords = [0, startIndex];
    board.colours.push(getRandomNumber(TETRIS_COLOURS.length));

    board = placeShape(board);
    return board;
}

export function deleteCompletedRows(board: TetrisBoard): TetrisBoard {
    const board_width = board.grid[0].length
    let rowsCleared = 0;
    for(let i = 0; i < board.grid.length; i++){
        const row = board.grid[i];
        const row_complete = !row.includes(0) && !row.includes(board.pieceColour);
        if(row_complete){
            board.grid[i] = Array(board_width).fill(0);
            board.shiftDown = i;
            rowsCleared++;
        }
    }
    if(rowsCleared > 0){
        board = scoreRow(board, rowsCleared);
    }
    board = scoreLevel(board, rowsCleared);
    return board;
}

function isPieceDead(board: TetrisBoard): boolean {
    const pieceShape = board.pieceShape;
    const pieceY = board.pieceCoords[0];
    const pieceX = board.pieceCoords[1];
    const colour = board.pieceColour;
    const grid = board.grid;
    for(let i = 0; i < pieceShape.length; i++){
        for(let j = 0; j < pieceShape[0].length; j++){
            if(pieceShape[i][j] == 1){
                if(i + pieceY + 1 == grid.length){
                    return true;
                }
                if(grid[i + pieceY + 1][j + pieceX] != 0 && grid[i + pieceY + 1][j + pieceX] != colour){
                    return true;
                }
            }
        }
    }
    return false;
}

function populateGuideArray(board: TetrisBoard): TetrisBoard{
    if(board.pieceShape.length == 0){
        return board;
    }
    const newGuideBlocks : Coord[] = [];
    const pieceY = board.pieceCoords[0];
    const pieceX = board.pieceCoords[1];
    if(!isPieceDead(board)){
        for(let j = 0; j < board.pieceShape[0].length; j++){
            let lowestRow = 0;
            for(let i = 0; i < board.pieceShape.length; i++){
                if(board.pieceShape[i][j]){
                    lowestRow = i;
                }
            }
            let row = lowestRow + pieceY + 1;
            let col = j + pieceX;
            while(row < board.grid.length && board.grid[row][col] == 0){
                newGuideBlocks.push({y: row, x: col});
                row++;
            }
        }
    }
    board.guideBlocks = newGuideBlocks;
    return board;
}

export function gravityStep(board: TetrisBoard): TetrisBoard {
    if(board.shiftDown >= 0){
        for(let i = board.shiftDown - 1; i >= 0; i--){
            for(let j = 0; j < board.grid[0].length; j++){
                const cell = board.grid[i][j];
                if(cell != 0){
                    board.grid[i][j] = 0;
                    board.grid[i + 1][j] = cell;
                }
            }
        }
        const row = board.grid[board.shiftDown];
        if(!row.every((cell) => cell == 0)){
            for(let i = board.shiftDown - 1; i >= 0; i--){
                const r = board.grid[i];
                if(r.every((cell) => cell == 0 || cell == board.pieceColour)){
                    board.shiftDown = i;
                    //if everything above new shiftDown is clear, set it to -1.
                    let resetShift = true;
                    for(let j = i; j >= 0; j--){
                        if(!board.grid[j].every((cell) => cell == 0 || cell == board.pieceColour)){
                            resetShift = false;
                        }
                    }
                    if(resetShift){
                        board.shiftDown = -1;
                    }
                    break;
                }
            }
        }
    }

    const pieceShape = board.pieceShape;
    if(pieceShape == undefined){
        return board;
    }

    const pieceStatus = isPieceDead(board);

    if(!pieceStatus){
        liftShape(board);
        board.pieceCoords[0] += 1;
        placeShape(board);
    }
    else{
        board = scoreDrop(board, 0);
        board.pieceType = "";
        board.pieceShape = [];
        board.pieceCoords = [0, 0];
        board.pieceColour += 1;
    }
    return board;
}

function getLevelBoundary(level: number): number{
    const boundary = [...Array(level)].map((_, i) => 5 * i).reduce((x1, x2) => x1 + x2);
    return boundary;
}

//Scoring functions
function scoreLevel(board: TetrisBoard, linesCleared: number): TetrisBoard {
    board.levelScore += TETRIS_LEVEL_SCORE[Math.min(4, linesCleared)];
    const levelBoundary = getLevelBoundary(board.level + 1);
    if(board.levelScore >= levelBoundary){
        board.level += 1;
    }
    return board;
}

function scoreDrop(board: TetrisBoard, translation: number): TetrisBoard{
    const translationVal = Math.max(1, translation - 1) + board.level;
    board.score += translationVal;
    return board;
}

function scoreRow(board: TetrisBoard, linesCleared: number): TetrisBoard{
    const linesClearedVal = Math.min(4, linesCleared);
    let linesClearedMultiplier = TETRIS_LINE_MULTIPLIER[linesClearedVal - 1] * board.level;
    const scoreAdded = board.grid[0].length * (linesClearedMultiplier * linesClearedVal);
    board.score += scoreAdded;
    return board;
}

export function getHighScore(): number{
    return JSON.parse(localStorage.getItem('tetris-score') || "0");
}

export function updateHighScore(score: number): number{
    const highScore: number = getHighScore();
    const settings = {maxAge: 180 * (MILLIS_IN_A_DAY / 1000)};
    if(highScore){
        if(score > highScore){
            localStorage.setItem('tetris-score', JSON.stringify(score));
            return score;
        }
        return 0;
    }
    localStorage.setItem('tetris-score', JSON.stringify(score));
    return score;
}