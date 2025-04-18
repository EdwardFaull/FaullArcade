'use client'
import React, { useEffect, useState } from "react";
import "@/app/layout.css"
import "./conundrumpage.css"
import CountdownGameRedesign from "./CountdownGameRedesign";

export default function CountdownPage() {
  
  const [animate, setAnimate] = useState<string | null>(null);

  useEffect(() => {
    const showAnimation = sessionStorage.getItem('tetris-anim');
    setAnimate(showAnimation);
    sessionStorage.setItem('tetris-anim', 'Y');
  }, [])


  return (
    <>
      <div className="countdown-layout">
        <div className="countdown-game-container">
          <CountdownGameRedesign animate={animate ? false : true}/>
        </div>
        {/* <div className="countdown-info-container">
          <Expandable initialState={false} animate={animate ? false : true} height="vtall" heading="About Conundrum">
              <p className="text-serif paragraph">
                The Conundrum is a word puzzle popularised by <a href="https://en.wikipedia.org/wiki/Countdown_(game_show)">Countdown</a>, a British game show broadcast on Channel 4 since 1982.
              </p>
              <p className="text-serif paragraph">
                Countdown itself is an offshoot of a French show with a similar format, <a href="https://en.wikipedia.org/wiki/Des_chiffres_et_des_lettres">Des chiffres et des lettres</a> (literally ‘The Numbers and the Letters’), which recently concluded 59 years of broadcast.
              </p>
              <p className="text-serif paragraph">
                Countdown has its own spinoff in the form of <a href="https://en.wikipedia.org/wiki/8_Out_of_10_Cats_Does_Countdown">8 Out of 10 Cats Does Countdown</a>,
                a panel show crossover starring a rotating cast of comedians and celebrities including Jon Richardson, the late Sean Lock, and Joe Wilkinson. It has overstayed its welcome.
              </p>
              <p className="text-serif paragraph">
                The Conundrum is an invention of the British show, and takes place at the end of the game. 
                Players are presented with a 9-letter puzzle which is an anagram of a 9-letter word. 
                Players have 30 seconds to buzz in and say the answer which, if they are correct, is revealed, and the successful guesser wins 10 points.
              </p>
              <p className="text-serif paragraph">
                If the game can be won as the result of the conundrum, it is called a <b>Crucial Conundrum</b>, and the lights in the studio change colour.
              </p>
              <p className="text-serif paragraph">
                Above is an adaptation of the Conundrum that you can play in your browser. 
                Unlike the studio version there is no time limit. However, <b>you can only make 6 attempts</b> on a Conundrum before losing.
              </p>
              <p className="text-serif paragraph">
                You may come back each day to find a new daily Conundrum. Complete it to build up your streak!
              </p>
          </Expandable>
        </div> */}
      </div>
    </>
  );
}