import { MinesweeperBoardSummaryProps, MinesweeperCell } from "@/types";
import React from "react";
import "./minesweepergame.css";
import Icon from "@/components/Icon/Icon";
import { isMobile } from "react-device-detect";

export default function MinesweeperBoardSummary( {board} : MinesweeperBoardSummaryProps ) {

    const getCellClass = (cell: MinesweeperCell, i: number, j: number): string => {
        const mainClass = "minesweeper-cell ";
        const openClass = (cell.status === "O" || cell.status === "X" && cell.value === -1) ? "minesweeper-cell-opened " : " ";
        const colourClass = (cell.status === "O" || cell.status === "X" && cell.value === -1) ? 
            (cell.value >= 0 ? " minesweeper-text-" + cell.value : " minesweeper-opened") :
            " minesweeper-unopened";
        return mainClass + openClass + colourClass;
    }

    const difficulty = board.difficulty;

    const difficultySize = (difficulty === 'beginner' ? 25 : 20) + "px";
    const iconHeight = (difficulty === 'beginner' ? 21 : 16) + "px";

    return (
        <div className="minesweeper-summary-container" style={{
            ...(isMobile ? {flexDirection: difficulty === 'expert' ? "row" : "column"}: {flexDirection: "column"})
            }}>
            {board && board.grid.map(
            (row, i) => {
                return <div key={'minesweeper-row-'+i} className="minesweeper-row" style={{
                    ...(isMobile ? {flexDirection: difficulty === 'expert' ? "column" : "row"}: {flexDirection: "row"})
                    }}>
                    {
                        row.map((cell, j) => <div 
                            key={'minesweeper-cell-'+i+'-'+j} 
                            className={getCellClass(cell, i, j)} 
                            style={{
                                width: difficultySize, height: difficultySize, 
                                maxWidth: difficultySize, maxHeight: difficultySize,
                                animation: "none", opacity: "100%", cursor: "default"
                            }}
                            >
                                {cell.value === -1 && cell.status !== "U" && 
                                <div style={{display: "flex", alignItems: "center"}}>
                                    <Icon iconName="mine" iconProps={{ viewBox: "0 0 256 256", height: iconHeight, width: difficultySize }} />
                                </div>
                                }
                        </div>
                        )
                    }
            </div>
            })}
        </div>
    );
}