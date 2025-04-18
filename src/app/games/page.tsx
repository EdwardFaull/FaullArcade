'use client'

import Card from "@/components/GameCard/GameCard";
import { CardProps } from "@/types";
import { useRouter } from "next/navigation";
import React from "react";
import "./games.css";

export default function Games(){

    const router = useRouter();

    const navigate = (location: string): void => {
        router.push(location);
    }

    const cards : CardProps[] = [
        {
            header: "Tetris",
            description: "Drop falling blocks in a grid. Complete rows to score!",
            location: "/games/tetris",
            colour: "var(--winterpink-pale)",
            callback: navigate,
        },
        {
            header: "Conundrum",
            location: "/games/countdown",
            description: "Solve a daily 9-letter anagram!",
            colour: "var(--winterblue-pale)",
            callback: navigate,
        },        
        {
            header: "Minesweeper",
            location: "/games/minesweeper",
            description: "Hunt for mines in a minefield - don't set any off!",
            colour: "var(--winterorange-pale)",
            callback: navigate,
        }
    ];

    return(
        <div className="games-container">
            <div className="games-flexbox">
                {cards.map((c) => <Card key={c.location} {...c} />)}
            </div>
        </div>
    )
}