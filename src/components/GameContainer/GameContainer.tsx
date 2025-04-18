import React, { ReactNode, useContext, useEffect } from "react";
import "./gamecontainer.css";
import { GameContext } from "../GameContext/GameContext";
export type GameContainerProps = {
    children: ReactNode;
    menuColour: string;
    gameColour: string;
    gameFadeDelay: number;
    onGameStart: () => void;
    onGameWon: () => void;
    onGameLost: () => void;
    onGameReset: () => void;
}

export default function GameContainer({children, menuColour, gameColour, gameFadeDelay, onGameStart, onGameWon, onGameLost, onGameReset} : GameContainerProps) {
    const context = useContext(GameContext);

    if(!context){
        return (<></>);
    }

    const { gameState, setShowPanel, gameWon, gameLost } = context;

    useEffect(() => {
        const handleGameReset = async () => {
            onGameReset();
            await setTimeout(() => setShowPanel('menu'), 1500);
        }
        const handleGameStart = async () => {
            onGameStart();
            await setTimeout(() => { setShowPanel("game") }, 1500);
            if(gameWon || gameLost){
                await setTimeout(() => setShowPanel("stats"), gameFadeDelay);
            }
        }
        const handleGameWon = async () => {
            onGameWon();
            await setTimeout(() => setShowPanel("stats"), gameFadeDelay);
        }
        const handleGameLost = async () => {
            onGameLost();
            await setTimeout(() => setShowPanel("stats"), gameFadeDelay);
        }

        switch(gameState){
            case "menu":
                handleGameReset();
                break;
            case "started":
                handleGameStart();
                break;
            case "won":
                handleGameWon();
                break;
            case "lost":
                handleGameLost();
                break;
        }
    }, [gameState]);

    return (
        <div className="game-container">
            <div className='game-box' style={{backgroundColor: gameState === 'menu' ? menuColour : gameColour}}>
                {children}
            </div>
        </div>
    );
}