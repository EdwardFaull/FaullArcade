'use client'
import React, { useEffect, useState } from "react";
import "@/app/layout.css"
import "./tetrispage.css"
import TetrisGame from "./TetrisGame";
import Expandable from "@/components/Expandable/Expandable";
import { KeyboardSquare } from "@/components/KeyboardSquare/KeyboardSquare";
import Icon from "@/components/Icon/Icon";

export default function TetrisPage() {

  const [animate, setAnimate] = useState<string | null>(null);

  useEffect(() => {
    const showAnimation = sessionStorage.getItem('tetris-anim');
    setAnimate(showAnimation);
    sessionStorage.setItem('tetris-anim', 'Y');
  }, [])

  return (
    <>
      <div className="tetris-layout">
        <div className="tetris-info-container">
          <Expandable initialState={true} animate={animate ? false : true} height="vtall" heading="About Tetris">
              <p className="text-serif paragraph">
                Tetris is a puzzle game created in 1985 by <a href="https://en.wikipedia.org/wiki/Alexey_Pajitnov">Alexey Pajitov</a> in the Soviet Union. 
                It recently celebrated its 40<sup>th</sup> birthday.
              </p>
              <p className="text-serif paragraph">
                Players must place falling 4-block shapes called ‘Tetronimos’ into a grid. 
                Filling a whole line with Tetronimo blocks clears the line, allowing the blocks above to fall down.
              </p>
              <p className="text-serif paragraph">
                If the stack of blocks reaches the top and no more blocks can be placed, the game is over. 
                In the original version of Tetris, there is no winning. 
                One can hope only to achieve the highest score possible, making tournaments a natural extension of the game's culture.
              </p>
              <p className="text-serif paragraph">
                The game was originally created for the Electronika 60, a Soviet-made personal computer system, but has since been adapted to run on almost all forms of device. 
                I remember playing the game as a child on my father's brick-shaped Nokia phone, which now sits (still functioning) in my bedside drawer.
              </p>
              <p className="text-serif paragraph">
                Above is an adaptation of Tetris that you can run on your desktop or mobile browser.
              </p>
          </Expandable>
          <div className="tetris-info-controls">
            <Expandable initialState={false} animate={animate ? false : true} height="tall" heading="How to play">
              <p className="text-serif paragraph">
                You can use the buttons on the control panel or your keyboard's arrow keys to play Tetris.
              </p>
              <div className="tetris-controls-info-line">
                <KeyboardSquare>
                  <Icon 
                    iconName="triangle" 
                    iconProps={{"width": "18px", "height": "18px"}}
                    pathProps={{"transform": "rotate(90) scale(0.666) translate(2, -26)"}}
                  />
                </KeyboardSquare>
                <span className="text-serif paragraph"> shift Tetronimo right.</span>
              </div>
              <div className="tetris-controls-info-line">
                <KeyboardSquare>
                  <Icon 
                    iconName="triangle" 
                    iconProps={{"width": "18px", "height": "18px"}}
                    pathProps={{"transform": "rotate(-90) scale(0.666) translate(-26, 0)"}}
                  />
                </KeyboardSquare>
                <span className="text-serif paragraph"> shift Tetronimo left.</span>
              </div>
              <div className="tetris-controls-info-line">
                <KeyboardSquare>
                  <Icon 
                    iconName="triangle" 
                    iconProps={{"width": "18px", "height": "18px"}}
                    pathProps={{"transform": "rotate(0) scale(0.666) translate(1, 1)"}}
                  />
                </KeyboardSquare>
                <span className="text-serif paragraph">or click</span>
                <div style={{"margin": "8px", "marginTop": "12px"}}>
                  <Icon iconName="arrow rotate" iconProps={{"transform": "scale(1.25)"}} pathProps={{"fill": "#000000", "fillOpacity": "0.75"}}/>
                </div>
                <span className="text-serif paragraph"> to rotate Tetronimo clockwise.</span>
              </div>
              <div className="tetris-controls-info-line">
                <KeyboardSquare>
                  <Icon 
                    iconName="triangle" 
                    iconProps={{"width": "18px", "height": "18px"}}
                    pathProps={{"transform": "rotate(180) scale(0.666) translate(-26, -26)"}}
                  />
                </KeyboardSquare>
                <span className="text-serif paragraph"> drop Tetronimo all the way to the bottom.</span>
              </div>
            </Expandable>
          </div>
        </div>
        <div className="tetris-game">
          <div className="tetris-game-container">
            <TetrisGame animate={animate ? false : true}/>
          </div>
        </div>
      </div>
    </>
  );
}