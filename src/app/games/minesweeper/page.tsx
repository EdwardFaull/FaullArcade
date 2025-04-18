'use client'
import React, { useEffect } from "react";
import "@/app/layout.css";
import "./minesweeperpage.css";
import MinesweeperGame from "./MinesweeperGame";

export default function MinesweeperPage() {
  return (
    <>
      <div className="minesweeper-layout">
        <div className="minesweeper-game-container">
          <MinesweeperGame/>
        </div>
      </div>
    </>
  );
}