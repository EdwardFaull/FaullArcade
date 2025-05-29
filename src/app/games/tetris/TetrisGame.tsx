'use client'
import React, { useEffect, useRef, useState } from "react";
import { cloneTetrisBoard, deleteCompletedRows, getHighScore, gravityStep, initTetrisBoard, isPieceDead, moveShape, placeTetronimo, rotateShape, skipShape, TETRIS_BOARD_HEIGHT, TETRIS_BOARD_WIDTH, TETRIS_COLOURS, updateHighScore } from "./Tetris";
import "./tetrisgame.css"
import { Prop, TetrisBoard, TetrisLevel } from "@/types";
import { useKeyPress } from "@/app/utils/useKeyPress";
import Icon from "@/components/Icon/Icon";
import { useInterval } from "@/app/utils/useInterval";
import { useKeyHold } from "@/app/utils/useKeyHold";
import { withCookies } from "react-cookie";
import { Mutex } from "async-mutex";

function TetrisGame({cookies, animate} : Prop) {
  const [board, setBoard] = useState<TetrisBoard>(initTetrisBoard(TETRIS_BOARD_WIDTH, TETRIS_BOARD_HEIGHT, 1));
  const [tick, setTick] = useState(0);
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const myInterval = useInterval(() => {setTick((prevTick) => prevTick + 1)}, 1500);
  const [showGuides, setShowGuides] = useState(false);
  const [currentHighScore, setCurrentHighScore] = useState(0);
  const [newHighScore, setNewHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [flashLevelText, setFlashLevelText] = useState(false);
  const myMutex = useRef<Mutex>(new Mutex());

  const headingText = "TETRIS"
  const gameOverText = "GAME OVER!";

  const levels: TetrisLevel[] = [
    {intervalMillis: 1500, showGuide: true, scoreBoundary: 200},
    {intervalMillis: 1250, showGuide: true, scoreBoundary: 500},
    {intervalMillis: 1000, showGuide: true, scoreBoundary: 1000},
    {intervalMillis: 800, showGuide: true, scoreBoundary: 2000},
    {intervalMillis: 700, showGuide: true, scoreBoundary: 4000},
    {intervalMillis: 600, showGuide: false, scoreBoundary: 6000},
    {intervalMillis: 400, showGuide: false, scoreBoundary: 8000},
    {intervalMillis: 200, showGuide: false, scoreBoundary: 10000},
    {intervalMillis: 100, showGuide: false, scoreBoundary: 12000},
    {intervalMillis: 75, showGuide: false, scoreBoundary: 15000},
  ]

  useEffect(() => {
    setCurrentHighScore(getHighScore());
    return () => {
      myInterval.stopInterval();
    }
  }, []);

  useEffect(() => {
    if(started){
      setGameOver(false);
      setBoard(() => {
        startGame(level);
        return initTetrisBoard(TETRIS_BOARD_WIDTH, TETRIS_BOARD_HEIGHT, level);
      });
    }
  }, [started]);

  useEffect(() => {
    if(started){
      handleStep();
    }
  }, [tick])

  useEffect(() => {
    if(flashLevelText){
      setTimeout(() => {setFlashLevelText(false)}, 2000);
    }
  }, [flashLevelText])

  const handleGameOver = (board: TetrisBoard) => {
    myMutex.current?.runExclusive(() => {
      myInterval.stopInterval();
      const newHighScore = updateHighScore(board.score);
      if(newHighScore){
        setCurrentHighScore(newHighScore);
      }
      setNewHighScore(newHighScore);
      setStarted(false);
      setGameOver(true);
    });
  }

  const resetGame = () => {
    setGameOver(false);
    setStarted(false);
    setLevel(1);
    setBoard(initTetrisBoard(TETRIS_BOARD_WIDTH, TETRIS_BOARD_HEIGHT, level));
  }

  const startGame = (level: number=1) => {
    myInterval.startInterval(levels[level ? level - 1 : board.level - 1].intervalMillis);
    setShowGuides(levels[level ? level - 1 : board.level - 1].showGuide);
  }

  const handleStep = () => {
    myMutex.current?.runExclusive(() => {
      setBoard(
        (prevState) => {
          const stateCopy = cloneTetrisBoard(prevState);
          const newState = placeTetronimo(deleteCompletedRows(gravityStep(stateCopy)));
          setLevel(newState.level);
          if(newState.level <= 10 && newState.level > level){
            myInterval.stopInterval();
            setFlashLevelText(true);
            startGame(newState.level);
          }
          if(newState.gameOver){
            handleGameOver(board);
          }
          if(isPieceDead(newState)){
            delayOnPieceComplete(newState);
          }
          return newState;
        }
      )
    });
  }

  const handleMoveShape = (direction : boolean) => {
    myMutex.current?.runExclusive(() => {
      setBoard(
        (prevState) => {
          const stateCopy = cloneTetrisBoard(prevState);
          const newState = moveShape(stateCopy, direction);
          return newState
        }
      )
    });
  }

  const delayOnPieceComplete = (newState: TetrisBoard) => {
    myInterval.stopInterval();
    setTimeout(() => {
      startGame(newState.level);
    }, 300);
  }

  const handleSkipShape = () => {
    myMutex.current?.runExclusive(
      async () => {
        setBoard(
          (prevState) => {
            const stateCopy = cloneTetrisBoard(prevState);
            const newState = skipShape(stateCopy);
            console.log(prevState);
            console.log(newState);
            if(newState.score > prevState.score){
              delayOnPieceComplete(newState);
            }
            return newState;
          }
        )
      }
    );
  }

  const handleRotateShape = () => {
    myMutex.current?.runExclusive(() => {
      setBoard(
        (prevState) => {
          const stateCopy = cloneTetrisBoard(prevState);
          const newState = rotateShape(stateCopy);
          return newState
        }
      )
    });
  }

  useKeyPress(handleRotateShape, "ArrowUp", true);
  useKeyPress(handleSkipShape, "ArrowDown", true);
  useKeyPress(() => handleMoveShape(false), "ArrowLeft", true);
  useKeyPress(() => handleMoveShape(true), "ArrowRight", true);

  useKeyHold(useInterval(() => handleMoveShape(false), 100), "ArrowLeft");
  useKeyHold(useInterval(() => handleMoveShape(true), 100), "ArrowRight");

  function renderRainbowText(text: string) {
    return (
      <div key="rainbow-text" style={{display: 'block'}} className="tetris-menu-item">
        {text.split('').map((char, i) => 
          <span 
            key={"text-"+i}
            style={{backgroundColor : 'transparent'}} 
            className={"tetris-text tetris-header " + TETRIS_COLOURS[(i + 3) % TETRIS_COLOURS.length]}>
              {char}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={"tetris-container" + (animate ? " fade-in" : "")}>
      {!started && !gameOver &&
        <div className="tetris-overlay start">
          {renderRainbowText(headingText)}
          {currentHighScore && <div className="tetris-menu-item">
            <p className="tetris-text tetris-menu" style={{textAlign: 'center', marginBottom: '8px'}}>HIGH SCORE</p>
            <p className="tetris-text tetris-menu" style={{textAlign: 'center', marginTop: '0px', marginBottom: '8px'}}>
              {currentHighScore < 10000 ? ("0000" + currentHighScore).slice(-4) : currentHighScore}
            </p>
          </div>
          }
          <div className="tetris-menu-item">
            <p className="tetris-text tetris-menu" style={{textAlign: 'center', marginBottom: '8px'}}>SELECT LEVEL</p>
            <div className="tetris-counter">
              <button className="tetris-button tetris-menu" onClick={() => setLevel((prevState) => Math.max(1, prevState - 1))}>
                <Icon iconName="arrow" iconProps={{"transform": "scale(-2, 2)"}}/>
              </button>
              <span className="tetris-text tetris-menu">{("00" + level).slice(-2)}</span>
              <button className="tetris-button tetris-menu" onClick={() => setLevel((prevState) => Math.min(10, prevState + 1))}>
                <Icon iconName="arrow" iconProps={{"transform": "scale(2)"}}/>
              </button>
            </div>
          </div>
          <div className="tetris-menu-item">
            <button className="tetris-button tetris-menu tetris-menu-text" onClick={() => setStarted(true)}>
              Start
            </button>
          </div>
        </div>
      }

      {gameOver &&
        <div className="tetris-overlay gameover">
          <div className="tetris-menu-item">
            {renderRainbowText(gameOverText)}
          </div>
          <div className="tetris-menu-item">
            {newHighScore ? 
              <p className="tetris-text tetris-menu tetris-blink" style={{textAlign: 'center', marginBottom: '8px'}}>NEW HIGH SCORE</p> :
              <p className="tetris-text tetris-menu" style={{textAlign: 'center', marginBottom: '8px'}}>YOUR SCORE</p>
            }
            <p className="tetris-text tetris-menu" style={{textAlign: 'center', marginTop: '8px'}}>
              {board.score < 10000 ? ("0000" + board.score).slice(-4) : board.score}
            </p>
          </div>
          <div className="tetris-menu-item">
            <button className="tetris-button tetris-menu tetris-menu-text" onClick={resetGame}>PLAY AGAIN?</button>
          </div>
        </div>
      }

      <div className="tetris-panel-wrapper">
        <div className="tetris-info-panel panel">
          <div key="level" className="tetris-info-item">
            <span className={"tetris-text tetris-info" + (flashLevelText ? " tetris-blink" : "")}>LEVEL<br />{started ? ("00" + level).slice(-2) : "00"}</span>
          </div>
          <div key="player" className="tetris-info-item">
            <span className="tetris-text tetris-info">PLAYER 1</span>
          </div>
          <div key="score" className="tetris-info-item">
            <span className="tetris-text tetris-info">SCORE <br /> {board.score < 10000 ? ("0000" + board.score).slice(-4) : board.score}</span>
          </div>
        </div>
      </div>
      <div className="tetris-panel-wrapper">
        <div className="tetris-game-panel panel">
          {
            board.grid.map(
              (row, i) => { 
                return <div key={'tetris-row-'+i} className="tetris-row">
                  {
                    row.map((cell, j) => {
                      return <div 
                        key={'tetris-cell-'+i+'-'+j} 
                        className={
                          "tetris-cell" + 
                          (cell > 0 ? 
                            (" tetris-block" + " " + TETRIS_COLOURS[board.colours[cell - 1]]) : 
                            (showGuides && board.guideBlocks.filter((c) => c.y == i && c.x == j).length > 0 ? " tetris-guide" : ""))
                        }
                        >
                        </div>;
                    })
                  }
                </div>
              }
            )
          }
        </div>
      </div>
      <div className="tetris-panel-wrapper">
        <div className="tetris-control-panel panel">
          <div style={{marginBottom: '9px', display: "flex", alignItems:"center"}}>
            <button className="tetris-button tetris-control" onClick={() => handleMoveShape(false)}>
              <Icon iconName="arrow" iconProps={{"transform": "scale(-2, 2)"}}/>
            </button>
            <button className="tetris-button tetris-control" onClick={() => handleRotateShape()}>
              <Icon iconName="arrow rotate" iconProps={{"transform": "scale(1.25)"}}/>
            </button>
            <button className="tetris-button tetris-control" onClick={() => handleMoveShape(true)}>
              <Icon iconName="arrow" iconProps={{"transform": "scale(2)"}}/>
            </button>
          </div>
          <button className="tetris-button tetris-control" onClick={() => handleSkipShape()}>
            <Icon iconName="arrow down" iconProps={{"transform": "scale(2)"}}/>
          </button>
        </div>
      </div>
    </div>
  );
}

export default withCookies(TetrisGame);