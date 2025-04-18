import { MinesweeperRadioButtonProps } from "@/types";
import React from "react";
import "./minesweeperradiobutton.css";

export default function MinesweeperButton({onClick, children, value, selector, className=""} : MinesweeperRadioButtonProps) {
    return(
        <button className={
            "minesweeper-menu-button" + 
            (selector == value ? " minesweeper-button-radio-active" : " minesweeper-button-radio-inactive")
            + (className ? " " + className : "") } 
            onClick={onClick}
            >
                {children}
        </button>
    );
}