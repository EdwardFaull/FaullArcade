import { CountdownDifficulty, MinesweeperDifficulty } from "@/types";
import { createContext, ReactNode } from "react";

export type Panel = "menu" | "game" | "stats" | "help";
export type GameState = "menu" | "started" | "won" | "lost";


export type GameContextProps = {
    gameState: GameState;
    showPanel: Panel;
    difficulty: CountdownDifficulty | MinesweeperDifficulty;
    gameWon: boolean;
    gameLost: boolean;
    setGameState : (React.Dispatch<React.SetStateAction<GameState>>);
    setShowPanel : React.Dispatch<React.SetStateAction<Panel>>;
}

export const GameContext = createContext<GameContextProps | undefined>(undefined);

type GameProviderProps = {children: ReactNode; context: GameContextProps};

export function GameProvider({children, context} : GameProviderProps) {
    return (
        <GameContext.Provider value={{...context}}>
            {children}
        </GameContext.Provider>
    );
}