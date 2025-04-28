'use client'
import React, { act, useEffect, useMemo, useState } from "react";
import "@/app/layout.css";
import "./minesweepergame.css";
import { Coordinate, AnimContainerProps, MinesweeperBoard, MinesweeperCell, MinesweeperDifficulty, MinesweeperStatus } from "@/types";
import { cloneMinesweeperBoard, flagCell, handleClick, initMinesweeperBoard, logStatistics, showMines } from "./Minesweeper";
import MinesweeperButton from "./MinesweeperButton";
import Icon from "@/components/Icon/Icon";
import AnimContainer from "../../../components/AnimContainer/AnimContainer";
import MinesweeperBoardSummary from "./MinesweeperBoardSummary";
import { useInterval } from "@/app/utils/useInterval";
import { GameProvider } from "@/components/GameContext/GameContext";
import GameContainer from "@/components/GameContainer/GameContainer";
import GameMenu from "@/components/GameMenu/GameMenu";
import StatisticsNumbers from "@/components/StatisticsNumbers/StatisticsNumbers";
import { isMobile } from "react-device-detect";
import GameNavbar from "@/components/GameNavbar/GameNavbar";

export default function MinesweeperGame() {

  const [board, setBoard] = useState<MinesweeperBoard>();

  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [explode, setExplode] = useState<Coordinate>({x: -1, y: -1});
  const [pageLoad, setPageLoad] = useState(false);

  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [gamesWon, setGamesWon] = useState(0);
  const [action, setAction] = useState<"open" | "flag">("open");
  
  const [gameState, setGameState] = useState<"menu" | "started" | "won" | "lost">("menu");
  const [showPanel, setShowPanel] = useState<"menu" | "game" | "stats" | "help">("menu");
  const [difficulty, setDifficulty] = useState<MinesweeperDifficulty>("beginner");
  const difficulties : MinesweeperDifficulty[] = ['beginner', 'intermediate', 'expert'];
  const [bestTimes, setBestTimes] = useState<{[key : string]: number}>({});

  const [time, setTime] = useState(0);
  const interval = useInterval(() => setTime((prevTime) => prevTime + 1), 1000);

  const minesweeperStyles : { [key: string] : string} = {
    "U": "minesweeper-unopened", 
    "O": "minesweeper-opened", 
    "X": "minesweeper-unopened minesweeper-flagged"
  };
  const difficultyDelay = {
    "beginner": {start: 50, open: 25, explode: 100},
    "intermediate": {start: 30, open: 20, explode: 60},
    "expert": {start: 20, open: 15, explode: 40},
  };

  useEffect(() => {
    readScores();
    return () => {
      interval.stopInterval();
    }
  }, []);

  const onGameStart = () => {
    setTime(0);
      setBoard(initMinesweeperBoard(difficulty));
      setPageLoad(true);
      setTimeout(() => {
        interval.startInterval();
      }, 2000);
  }

  const onGameLost = () => {
    logStatistics(board, setGamesPlayed, setGamesWon);
  }

  const onGameWon = () => {
    updateScore();
    logStatistics(board, setGamesPlayed, setGamesWon);
    setBoard((prevState) => {
      if(prevState){
        let stateCopy = cloneMinesweeperBoard(prevState)
        const newState = showMines(stateCopy);
        return newState;
      }
      return prevState;
    });
  };

  const onGameReset = () => {
    setGameWon(false);
    setGameOver(false);
    setExplode({x: -1, y: -1});
    setTimeout(() => {
      setBoard(undefined);
    }, 1200);
  }

  const updateScore = () => {
    const highScore = bestTimes[difficulty];
    if(time < highScore || highScore === -1){
      localStorage.setItem(`minesweeper-score-${difficulty}`, JSON.stringify(time));
      setBestTimes((prevState) => {
        const copy = JSON.parse(JSON.stringify(prevState)); 
        copy[difficulty] = time; 
        return copy; 
      });
    }
  }

  const readScores = () => {
    for(let i = 0; i < difficulties.length; i++){
      const diff = difficulties[i];
      const highscore : number = JSON.parse(localStorage.getItem(`minesweeper-score-${diff}`) || "-1");
      setBestTimes((prevState) => { 
        const copy = JSON.parse(JSON.stringify(prevState)); 
        copy[diff] = highscore; 
        return copy; 
      });
    }
  }

  const handleDifficultyChange = (e: React.MouseEvent<any, any>, difficulty: MinesweeperDifficulty): void => {
    setDifficulty(difficulty);
  }

  const handleCellClick = (i: number, j: number) => {
    if(isMobile && action === 'flag'){
      handleCellContext(undefined, i, j);
    }
    else{
      const coordinate: Coordinate = {x: j, y: i};
      if(explode.x >= 0 && explode.y >= 0 || gameWon){
        return;
      }
      setBoard((prevState) => {
        if(prevState){
          if(prevState.grid[i][j].value == -1){
            setExplode(coordinate);
            interval.stopInterval();
            setGameState('lost');
          }
          const stateCopy = cloneMinesweeperBoard(prevState);
          const newState = handleClick(stateCopy, coordinate);
          if(newState.cellsUnopened == newState.mines.length){
            interval.stopInterval();
            setTimeout(() => {
              setGameState('won');
            }, 1000);
          }
          return newState;
        }
        return prevState;
      });
    }
  }

  const handleCellContext = (e: React.MouseEvent<any, any> | undefined, i: number, j: number) => {
    if(e) 
      e.preventDefault();
    const coordinate: Coordinate = {x: j, y: i};
    if(explode.x >= 0 && explode.y >= 0 || gameWon){
      return;
    }
    setBoard((prevState) => {
      if(prevState){
        const stateCopy = cloneMinesweeperBoard(prevState);
        const newState = flagCell(stateCopy, coordinate);
        return newState;
      }
      return prevState;
    });
  }

  const handleFlagClick = () => {
    if(!isMobile){
      return;
    }
    setAction((prevAction) => prevAction === 'open' ? 'flag' : 'open');
  }

  const getRippleDelay = (cell: MinesweeperCell, i: number, j: number): number => {
    if(showPanel !== 'game'){
      return 0;
    }
    if(gameWon){
      const multiplier = difficultyDelay[difficulty].start;
      return (i + j) * multiplier + 50 + (cell.value === -1 ? 0 : 1000);
    }
    if(explode.x >= 0 && explode.y >= 0){
      if(cell.status === "O" && cell.value === -1){
        return 0;
      }
      const dy = Math.abs(i - explode.y);
      const dx = Math.abs(j - explode.x);
      const multiplier = difficultyDelay[difficulty].explode;
      return (dy + dx) * multiplier + 1000;
    }
    if(cell.status == "U"){
      const multiplier = difficultyDelay[difficulty].start;
      return (i + j) * multiplier + 1500;
    }
    if(cell.status == "O"){
      const multiplier = difficultyDelay[difficulty].open;
      return (cell.delay? cell.delay : 0) * multiplier;
    }
    return 0;
  }

  const getCellClass = (cell: MinesweeperCell, i: number, j: number): string => {
    if(showPanel !== 'game'){
      return "minesweeper-cell-hide";
    }
    const mainClass = minesweeperStyles[cell.status] + " minesweeper-cell";
    const openClass = cell.status == "O" ? 
      (cell.value >= 0 ? (!gameWon ? " minesweeper-text-" + cell.value : " minesweeper-text-0") : 
        (gameWon ? " minesweeper-opened-mine-win" : " minesweeper-opened-mine")) : "";
    const explodeClass = (explode.x >= 0 && explode.y >= 0) ? " minesweeper-explode" : "";
    if(cell.status === "O" && cell.value === -1){
      return mainClass + openClass;
    }
    return mainClass + openClass + explodeClass;
  }

  const getTextClass = (cell: MinesweeperCell, i: number, j: number): string => {
    if(gameWon || showPanel !== 'game'){
      return "minesweeper-text minesweeper-text-hide";
    }
    const mainClass = "minesweeper-text";
    const explodeClass = (explode.x >= 0 && explode.y >= 0) ? " minesweeper-text-hide" : "";
    return mainClass + explodeClass;
  }

  const menuOffset = useMemo(() => gameState === 'menu' ? 200 : 0, [gameState]);

  return (
    <>
      <GameProvider context={{ gameState, showPanel, difficulty, gameWon, gameLost: gameOver, setGameState, setShowPanel }}>
        <GameContainer
          menuColour="var(--winterorange-pale)"
          gameColour="var(--winterwhite)"
          gameFadeDelay={6000}
          onGameStart={onGameStart}
          onGameWon={onGameWon}
          onGameLost={onGameLost}
          onGameReset={onGameReset}>
            <GameNavbar />
            {showPanel === 'menu' && 
              <GameMenu buttonText="Play" buttonOrder={5} menuOffset={menuOffset}>
                <AnimContainer key={0} order={0} delay={150} offset={menuOffset} open={gameState === 'menu'} close={gameState !== 'menu'}>
                  <p className="minesweeper-menu-text pt-serif minesweeper-heading"><b>Minesweeper</b></p>
                </AnimContainer>
                <AnimContainer key={1} order={1} delay={150} offset={menuOffset} open={gameState === 'menu'} close={gameState !== 'menu'}>
                  <p>Clear the minefield without hitting a mine to win!</p>
                  {bestTimes[difficulty] > 0 && <p className="minesweeper-menu-text pt-serif">Best Time <b>{bestTimes[difficulty]} seconds</b></p>}
                  <p className="minesweeper-menu-text pt-serif">Select level:</p>
                </AnimContainer>
                <div className="minesweeper-difficulty-panel" style={{order: 2}}>
                  <AnimContainer key={2} order={2} delay={150} offset={menuOffset} open={gameState === 'menu'} close={gameState !== 'menu'}>
                    <MinesweeperButton onClick={(e) => handleDifficultyChange(e, "beginner")} value="beginner" selector={difficulty}>Beginner</MinesweeperButton>
                  </AnimContainer>
                  <AnimContainer key={3} order={3} delay={150} offset={menuOffset} open={gameState === 'menu'} close={gameState !== 'menu'}>
                    <MinesweeperButton onClick={(e) => handleDifficultyChange(e, "intermediate")} value="intermediate" selector={difficulty}>Intermediate</MinesweeperButton>
                  </AnimContainer>
                  <AnimContainer key={4} order={4} delay={150} offset={menuOffset} open={gameState === 'menu'} close={gameState !== 'menu'}>
                    <MinesweeperButton onClick={(e) => handleDifficultyChange(e, "expert")} value="expert" selector={difficulty}>Expert</MinesweeperButton>
                  </AnimContainer>
                </div>
                {
                    isMobile && difficulty !== 'beginner' && 
                    <div className="minesweeper-menu-difficulty-warning">
                      <AnimContainer key={6} order={6} delay={gameState === 'menu' ? 0 : 150} offset={0} open={gameState === 'menu'} close={gameState !== 'menu'}>
                        <p className="minesweeper-menu-text pt-serif"><em>It is recommended to use a stylus on higher difficulties.</em></p>
                      </AnimContainer>
                    </div>
                }
              </GameMenu>
            }
            {showPanel === 'game' &&
              <div 
                className={`minesweeper-game-panel ${gameState !== 'started' ? "minesweeper-panel-hide" : ""}`} 
                style={{animationDelay: "4000ms"}}>
                <div className="minesweeper-flex-panel">
                  <div className="minesweeper-table" style={{
                    ...(isMobile ? {gap: difficulty === 'beginner' ? "0.75vw" : "0.3vw"} : {}),
                    ...(isMobile ? {flexDirection: difficulty === 'expert' ? "row" : "column"}: {})
                    }}>
                    {
                      board && board.grid.map(
                        (row, i) => { 
                          return <div className="minesweeper-row" key={`row-${i}`} style={{...(isMobile ? {flexDirection: difficulty === 'expert' ? "column" : "row"}: {})}}>
                            {
                              row.map((cell, j) => {
                                return <div 
                                  className={
                                    getCellClass(cell, i, j) + (" " + (board.grid[0].length * i + j))
                                  }
                                  key={`cell-${i}-${j}`}
                                  style={{
                                    animationDelay : getRippleDelay(cell, i, j) + "ms", 
                                    transitionDelay : (getRippleDelay(cell, i, j) + (cell.status !== "O" && cell.value !== 0 ? 200 : 0)) + "ms",
                                    ...(isMobile ? {width: difficulty === 'beginner' ? "9vw" : "5.5vw", height: difficulty === 'beginner' ? "9vw" : "5.5vw"} : {})
                                  }}
                                  onClick={() => handleCellClick(i, j)}
                                  onContextMenu={(e) => handleCellContext(e, i, j)}
                                  >
                                    {cell.value == -1 && cell.status === "O" && <Icon iconName="mine" iconProps={{viewBox: "0 0 256 256", height: "36px", width: "36px", transform: "translate(0, 2)"}} />}
                                    {cell.status == "X" && <Icon iconName="flag" iconProps={{viewBox: "0 0 256 256", height: "36px", width: "36px", transform: "translate(0, 2)"}} />}
                                    {cell.value > 0 && cell.status == "O" && 
                                      <span 
                                        className={getTextClass(cell, i, j)} 
                                        style={{animationDelay : getRippleDelay(cell, i, j) + "ms", ...(isMobile ? {fontSize: difficulty === 'beginner' ? "5vw" : "3.5vw"} : {})}}>
                                        {cell.value}
                                      </span>
                                      }
                                  </div>;
                              })
                            }
                          </div>
                        }
                      )
                    }
                  </div>
                  <div className="minesweeper-game-info-panel">
                    <div className="minesweeper-game-info-item" style={{animationDelay:"1500ms"}}>
                      <span className="minesweeper-info-text pt-serif">{time}</span>
                    </div>
                    <div onClick={handleFlagClick} className={`minesweeper-game-info-item ${action === 'flag' ? "minesweeper-game-info-item-active" : ""}`} style={{animationDelay:"1800ms"}}>
                      <Icon iconName="flag" iconProps={{ viewBox: "0 0 256 256", height: "36px", width: "36px" }} />
                      <span className="minesweeper-info-text pt-serif">{board?.flagCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            }
            {
              showPanel === 'stats' && pageLoad && <div className={"minesweeper-summary-panel"} style={{animationDelay: "3600ms"}}>
              <>
                <AnimContainer order={0} delay={150} open={gameState === 'won' || gameState === 'lost'} close={!(gameState === 'won' || gameState === 'lost')}>
                  <p className="minesweeper-menu-text pt-serif minesweeper-heading" style={{marginTop: "0px"}}>
                    {gameState === 'won' ? 
                      <>You completed the board in <b>{time} seconds</b>!</> :
                      <>You hit a mine!</>
                    }
                  </p>
                </AnimContainer>
                <AnimContainer order={1} delay={150} open={gameState === 'won' || gameState === 'lost'} close={!(gameState === 'won' || gameState === 'lost')}>
                  <StatisticsNumbers hr stats={[{title: "Played", value: gamesPlayed}, {title: "Win %", value: Math.floor(100 * gamesWon / gamesPlayed)}]} />
                </AnimContainer>
                <AnimContainer order={2} delay={150} open={gameState === 'won' || gameState === 'lost'} close={!(gameState === 'won' || gameState === 'lost')}>
                  <p className="minesweeper-menu-text pt-serif">Your field:</p>
                  {board && <MinesweeperBoardSummary board={board} />}
                </AnimContainer>
                <AnimContainer order={3} delay={150} open={gameState === 'won' || gameState === 'lost'} close={!(gameState === 'won' || gameState === 'lost')}>
                  <MinesweeperButton onClick={() => {setGameState('menu');}}>Play again?</MinesweeperButton>
                </AnimContainer>
              </>
            </div>
            }
            {
              showPanel === 'help' && <>
                
              </>
            }
        </GameContainer>
      </GameProvider>
    </>
  );
}