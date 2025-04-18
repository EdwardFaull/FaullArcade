import React from "react";
import "./keyboardsquare.css"
import { KeyboardSquareProps } from "@/types";

export function KeyboardSquare({children} : KeyboardSquareProps){
    return (
        <div className="keyboard-square-container">
            {children}
        </div>
    )
}