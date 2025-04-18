import React, { useEffect, useRef, useState } from "react";
import { addToList, checkAnswer, checkCompleted, getStreak, resetStreak, selectConundrum } from "./Countdown";
import { Conundrum, Prop } from "@/types";
import "./conundrumgame.css";
import "./conundrumbox.css"
import { withCookies } from "react-cookie";
import ConundrumBox from "./ConundrumBox";

function CountdownGame({cookies, animate} : Prop) {
    
    const [conundrum, setConundrum] = useState<Conundrum>()
    const [currentAnswer, setCurrentAnswer] = useState("");
    const [started, setStarted] = useState(false);
    const [todayCompleted, setTodayCompleted] = useState(false); 
    const inputRef = useRef<(HTMLInputElement)[]>([].slice(0, 9));
    const [previousGuesses, setPreviousGuesses] = useState<string[]>([]);
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        setConundrum(selectConundrum());
        setStreak(getStreak(cookies));
        const previousGuessesString = cookies.get('conundrum-guesses');
        const previousGuesses = previousGuessesString ? previousGuessesString.split(','): [];
        setPreviousGuesses(previousGuesses ? previousGuesses : []);
        setTodayCompleted(checkCompleted(cookies, previousGuesses));
        disableInput();
    }, []);

    useEffect(() => {
        if(todayCompleted){
            doForEachInput((el, s) => {el.value = s}, conundrum?.answer);
        }
    }, [todayCompleted]);

    useEffect(() => {
        if(started){
            setTimeout(() => focusOnInput(0), 1000);
        }
    }, [started]);

    const focusOnInput = (i: number) => {
        if(inputRef.current){
            if(inputRef.current[i]){
                disableInput();
                inputRef.current[i].disabled = false;
                inputRef.current[i].focus();
            }
        }
    }

    const doForEachInput = (callback: (el: HTMLInputElement, s: string) => any, s: string = "") => {
        if(inputRef.current){
            for(let ind = 0; ind < 9; ind++){
                if(inputRef.current[ind]){
                    callback(inputRef.current[ind], s[ind])
                }
            }
        }
    }

    const disableInput = () => {
        doForEachInput((el) => { el.disabled = true; });
    }

    const clearInput = () => {
        doForEachInput((el) => { el.value = ""; });
    }

    const flashInput = async (colour: 'red' | 'green', reset:boolean=false) => {
        disableInput();
        doForEachInput((el) => {el.className += " answer-" + colour;});
        setTimeout(() => {
            doForEachInput((el) => {
                el.className = el.className.replace(" answer-" + colour, "");
            });
            if(reset){
                disableInput();
                clearInput();
                focusOnInput(0);
            }
        }, 2000);
    }

    const addCharacter = (char: string) => {
        if(/[a-z]/.test(char)){
            const newLength = currentAnswer.length + 1;
            if(newLength <= 9){
                setCurrentAnswer((prevState) => {
                    const newState = prevState + char; 
                    return newState;
                });
            }
        }
    }

    const removeCharacter = () => {
        const newLength = currentAnswer.length - 1;
        if(newLength >= 0){
            setCurrentAnswer((prevState) => {
                const newState = prevState.slice(0, prevState.length - 1); 
                return newState;
            });
        }
    }

    const fillNextBox = (data: string, index: number) => {
        const nextBoxRef = inputRef.current[index];
        nextBoxRef.value = data;
        focusOnInput(index);
    }

    const onKeyDown = (e: React.KeyboardEvent) => {
        if(e.key){
            if(e.key === "Enter"){
                if(currentAnswer.length === 9){
                    handleButton();
                }
            }
        }
    }

    const onInput = (e: React.FormEvent<HTMLInputElement>) => {
        const inputEvent = e.nativeEvent as InputEvent;
        const type = inputEvent.inputType;
        if(type === "deleteContentBackward"){
            removeCharacter();
            focusOnInput(Math.max(0, currentAnswer.length - 2));
        }
        else if(type === "insertText"){
            const data = inputEvent.data;

            const target = e.target as HTMLInputElement;
            const value = target.value;
            if(data){
                if(value.length > 1){
                    target.value = value[0];
                    fillNextBox(data, Math.min(8, currentAnswer.length));
                }
                addCharacter(inputEvent.data);
            }
        }
    }

    const onSelect = (e: React.SyntheticEvent<HTMLInputElement, Event>) => {
        const target = e.target as HTMLInputElement;
        if(target.value){
            e.preventDefault();
            target.setSelectionRange(1, 1);
        }
    }

    const handleButton = async () => {
        if(!started){
            setStarted(true);
        }
        else{
            if(conundrum && checkAnswer(currentAnswer, conundrum, cookies)){
                setCurrentAnswer("");
                setStreak((prevStreak) => prevStreak + 1);
                await setTimeout(() => {
                    flashInput('green');
                }, 250);
                setTodayCompleted(true);
            }
            else{
                const newGuesses = addToList(currentAnswer, previousGuesses, cookies);
                setPreviousGuesses(newGuesses);
                setCurrentAnswer("");
                if(newGuesses.length >= 6){
                    await setTimeout(() => {
                        flashInput('red');
                    }, 250);
                    setTodayCompleted(true);
                    resetStreak(cookies);
                    setStreak(0);
                }
                else{
                    await setTimeout(() => {
                        flashInput('red', true);
                    }, 250);
                }
            }
        }
    }

    return (
        <div className={"conundrum-container" + (animate ? " conundrum-fade-in" : "")}>
            <div className="conundrum-quiz-container">
                <ConundrumBox key={'prompt'} showContent={started || todayCompleted}>
                    {
                        [...Array(9).keys()].map(
                            (i) => 
                            <div key={"prompt-cell-"+i} className={"conundrum-box cell conundrum-depth" + (i < 8 ? " no-right" : "")}> 
                                <span className="conundrum-text text-white board">{conundrum && conundrum.prompt[i].toUpperCase()}</span> 
                            </div>
                        )
                    }
                </ConundrumBox>

                <ConundrumBox key={'button'} showContent={!todayCompleted} delay={1.5}>
                    {
                        <button 
                            className={"conundrum-text cell conundrum-button conundrum-depth" + (!todayCompleted && (!started || started && currentAnswer.length == 9) ? " button-active" : "")} 
                            onClick={handleButton} 
                            style={{width: 'fit-content'}}
                            disabled={todayCompleted || (started && currentAnswer.length !== 9)}>
                                {started ? "ENTER" : "START"}
                        </button>
                    }
                </ConundrumBox>

                {
                    todayCompleted && 
                    (
                        (previousGuesses && previousGuesses.length) >= 6 ?
                        <p className="conundrum-text text-white conundrum-text-guess">Better luck next time! <br /> A new Conundrum will appear tomorrow.</p>:
                        <p className="conundrum-text text-white conundrum-text-guess">You answered the Conundrum with {previousGuesses.length + 1} {previousGuesses.length + 1 == 1 ? "try" : "tries"}! <br /> You're on a {streak} day streak.</p>
                    )
                }

                {
                    (started && !todayCompleted) && 
                    <p className="conundrum-text text-white conundrum-text-guess">{Math.min(6, previousGuesses.length + 1)} / 6</p>
                }
                <ConundrumBox key={'answer'} showContent={started || todayCompleted} delay={2}>
                    {
                        [...Array(9).keys()].map(
                            (i) =>  
                            <div key={"answer-cell-"+i} className={"conundrum-box cell conundrum-depth answer" + (i < 8 ? " no-right" : "")}> 
                                <input 
                                    className="conundrum-text input text-white"
                                    maxLength={i == 8 ? 1 : 2}
                                    onKeyDown={(e) => onKeyDown(e)}
                                    onInput={(e) => onInput(e)} 
                                    onSelect={(e) => onSelect(e)}
                                    ref={(el) => { if(el){ inputRef.current[i] = el; } }}
                                    />
                            </div>
                        )
                    }
                </ConundrumBox>
            </div>
              
            <div className="conundrum-guesses-container">
                {
                    (started || todayCompleted) && previousGuesses.map((guess, i) => 
                        <ConundrumBox key={i} showContent={true} fade={true} margin={false} delay={previousGuesses.length - i - 1}>
                            {
                                [...Array(9).keys()].map(
                                    (i) => 
                                    <div key={"prompt-cell-"+i} className={"conundrum-box cell guess conundrum-depth" + (i < 8 ? " no-right" : "")}> 
                                        <span className="conundrum-text text-white board">{guess && guess[i].toUpperCase()}</span> 
                                    </div>
                                )
                            }
                        </ConundrumBox>
                    )
                }
            </div>
            
        </div>
    );

}

export default withCookies(CountdownGame);