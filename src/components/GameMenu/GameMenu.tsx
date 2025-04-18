import React, { ReactNode, useContext } from "react";
import AnimContainer from "../AnimContainer/AnimContainer";
import "./gamemenu.css";
import { GameContext } from "../GameContext/GameContext";

export type GameMenuProps = {
    buttonText: string;
    buttonOrder: number;
    children: ReactNode;
    menuOffset: number;
};

export default function GameMenu({ children, buttonText, buttonOrder, menuOffset } : GameMenuProps){
    const context = useContext(GameContext);

    if(!context){
        return (<></>);
    }

    const { gameState, setGameState } = context;
    
    return (
        <div className="game-start pt-serif">
            {children}
            <AnimContainer key={2} order={buttonOrder} delay={150} offset={menuOffset} open={gameState === 'menu'} close={gameState !== 'menu'}>
                <button onClick={() => setGameState('started')} className="game-button-start pt-serif">{buttonText}</button>
            </AnimContainer>
        </div>
    );
}