import React from "react";
import "./mobilekeyboard.css"
import Icon from "../Icon/Icon";

export type MobileKeyboardProps = {
    onClick: (k: string) => void;
}

export default function MobileKeyboard({onClick} : MobileKeyboardProps){

    const rows = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"], 
        ["A", "S", "D", "F", "G", "H", "J", "K", "L"], 
        ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"]
    ]

    return (
        <div className="mobile-keyboard-container">
            {
                rows.map((row, i) => 
                    <div key={i} className="mobile-keyboard-row">
                        {
                            row.map((cell) => 
                                <button onClick={() => onClick(cell)} key={cell} className={`atkinson-hyperlegible-mono mobile-keyboard-cell ${cell === "Backspace" ? "mobile-keyboard-backspace" : cell === "Enter" ? "mobile-keyboard-enter" : ""}`}>
                                    {cell.length === 1 ? cell : (cell === "Backspace" ? <Icon iconName="delete" iconProps={{width: "30px", height: "30px"}}/> : "ENTER")}
                                </button>
                            )
                        }
                    </div>
                )
            }
        </div>
    )
}