import React, { useEffect, useMemo, useState } from "react";
import { addToList, checkAnswer, checkCompleted, getConundrumIndex, getStreak, isGuessValid, resetStreak, selectConundrum } from "./Countdown";
import { Conundrum, Prop } from "@/types";
import { withCookies } from "react-cookie";
import "./conundrumgame-redux.css";
import { useKeyPress } from "@/app/utils/useKeyPress";
import AnimContainer from "../../../components/AnimContainer/AnimContainer";
import ToggleButton from "@/components/ToggleButton/ToggleButton";
import GameContainer from "@/components/GameContainer/GameContainer";
import GameMenu from "@/components/GameMenu/GameMenu";
import { GameProvider, GameState, Panel } from "@/components/GameContext/GameContext";
import { isMobile } from "react-device-detect";
import MobileKeyboard from "@/components/MobileKeyboard/MobileKeyboard";
import StatisticsNumbers from "@/components/StatisticsNumbers/StatisticsNumbers";
import { getBarChartStatistics, getStatistics, logExtraStat, logStatistics } from "@/app/utils/statistics";
import StatisticsBarChart from "@/components/StatisticsBarChart/StatisticsBarChart";
import Icon from "@/components/Icon/Icon";
import GameNavbar, { GAME_NAVBAR_ICON_DIM, GameNavbarButton } from "@/components/GameNavbar/GameNavbar";
import { getDate } from "@/app/utils/Utils";
import GameDisclosure from "@/components/GameDisclosure/GameDisclosure";
import useDisclosure from "@/app/utils/useDisclosure";
import CountdownRow from "./CountdownRow";


function CountdownGameRedesign({cookies, animate} : Prop) {

    const MAX_GUESSES : number = 5;
    
    const [conundrum, setConundrum] = useState<Conundrum>();
    const [currentAnswer, setCurrentAnswer] = useState("");
    const [todayCompleted, setTodayCompleted] = useState(false); 
    const [previousGuesses, setPreviousGuesses] = useState<string[]>([]);
    const [previousGuessesColours, setPreviousGuessesColours] = useState<string[][]>([]);
    const [guessInvalid, setGuessInvalid] = useState(false);
    
    const [streak, setStreak] = useState(0);
    const [difficulty, setDifficulty] = useState<"easy"|"normal">(localStorage.getItem("countdown-difficulty") as "easy"|"normal" || "normal");
    const [gameState, setGameState] = useState<GameState>("menu");
    const [showPanel, setShowPanel] = useState<Panel>("menu");

    const statPanelControls = useDisclosure();
    const helpPanelControls = useDisclosure();
    

    useEffect(() => {
        setConundrum(selectConundrum());
        setStreak(getStreak(cookies));
        const previousGuessesString = cookies.get('conundrum-guesses');
        const previousGuesses = previousGuessesString ? previousGuessesString.split(','): [];
        setPreviousGuesses(previousGuesses ? previousGuesses : []);
        setTodayCompleted(checkCompleted(cookies, previousGuesses));
    }, []);

    useEffect(() => {
        const resetGuess = async () => {
            await setTimeout(() => setGuessInvalid(false), 750);
        }
        if(guessInvalid){
            resetGuess();
        }
    }, [guessInvalid]);

    useEffect(() => {
        const colours : string[][] = [];
        for(let i = 0; i < previousGuesses.length; i++){
            colours.push(getGuessColours(conundrum?.answer || "", previousGuesses[i]));
        }
        setPreviousGuessesColours(colours);
    }, [previousGuesses])

    const handleGameStart = () => {
        if(gameWon || gameLost){
            setGameState("finished");
            setTimeout(() => statPanelControls.onOpen(), 3000);
        }
    }

    const handleGameWon = () => {
        logStatistics('countdown', true, streak + 1);
        logExtraStat('countdown', `guess-${previousGuesses.length}`);
        setStreak((prevStreak) => prevStreak + 1);
        setTodayCompleted(true);
        setTimeout(statPanelControls.onOpen, 3000);
    }
    const handleGameLost = () => {
        setTodayCompleted(true);
        logStatistics('countdown', false, 0);
        resetStreak(cookies);
        setStreak(0);
        setTimeout(statPanelControls.onOpen, 3000);
    }

    const handleSubmitButton = () => {   
        if(currentAnswer.length === 9){
            if(isGuessValid(currentAnswer)){
                const newGuesses = addToList(currentAnswer, previousGuesses, cookies);
                setPreviousGuesses(newGuesses);
                setCurrentAnswer("");

                if(conundrum && checkAnswer(currentAnswer, conundrum, cookies)){
                    setGameState("won");
                }
                else if(newGuesses.length >= MAX_GUESSES){
                    setGameState('lost');
                }
            }
            else{
                setGuessInvalid(true);
            }
        }
    }

    const handleDeleteButton = () => {
        setCurrentAnswer((prevState) => prevState.length > 0 ? prevState.substring(0, prevState.length - 1) : prevState);
    }

    const handleChangeDifficulty = () => {
        const newDifficulty = difficulty === 'easy' ? 'normal' : 'easy';
        setDifficulty(newDifficulty);
        localStorage.setItem("countdown-difficulty", newDifficulty);
    }

    const handleKeyPress = (event?: KeyboardEvent | null, k : string = "") => {
        if(gameWon || gameLost){
            return;
        }
        const key = event?.key.toLowerCase() || k.toLowerCase();
        if(key === "backspace"){
            handleDeleteButton();
        }
        else if(key === "enter"){
            if(currentAnswer.length === 9){
                handleSubmitButton();
            }
        }
        else if(key.length === 1 && (key >= 'a' && key <= 'z')){
            setCurrentAnswer((prevState) => prevState.length < 9 ? `${prevState}${key}` : prevState);
        }
    }

    const getGuessColours = (answer: string, guess: string): string[] => {
        const n = 9;
        const colours = [...Array(n)].map(_ => "");
        for(let i = 0; i < n; i++){
            if(answer[i] === guess[i]){
                colours[i] = "blue";
                answer = answer.slice(0, i) + ' ' + answer.slice(i + 1);
            }
        }
        for(let i = 0; i < n; i++){
            if(answer.includes(guess[i]) && colours[i] === ""){
                colours[i] = "amber";
                const index = answer.indexOf(guess[i]);
                answer = answer.slice(0, index) + ' ' + answer.slice(index + 1);
            }
        }
        for(let i = 0; i < n; i++){
            if(colours[i] === ""){
                colours[i] = "grey"
            }
        }
        return colours;
    }

    const handleMobileKeyPress = (k : string) => {
        if(gameWon || gameLost){
            return;
        }
        handleKeyPress(null, k);
    }

    const gameWon = useMemo(() => todayCompleted, [todayCompleted]);
    const gameLost = useMemo(() => previousGuesses.length === MAX_GUESSES, [previousGuesses]);
    const menuOffset = useMemo(() => gameState === 'menu' ? 100 : 0, [gameState]);
    const statistics = useMemo(() => getStatistics('countdown'), [gameWon, gameLost]);
    const barStatistics = useMemo(() => getBarChartStatistics('countdown-guess', [...Array(MAX_GUESSES).keys()].map((_, i) => (i + 1).toString())), [gameWon, gameLost]);

    useKeyPress(handleKeyPress, undefined, true, [currentAnswer, previousGuesses, conundrum, streak, todayCompleted, gameWon, gameLost]);

    const menuText = (
            todayCompleted ? (
                gameWon ? <p>Great job solving today's puzzle! Check back tomorrow for another Conundrum.</p> : 
                <p>Hard luck today. Try again tomorrow.</p>
            ) : (
                streak ? <p>Welcome back! Play to continue your <b>{streak} day</b> streak.</p> : 
                <p>Welcome to Conundrum! Find the 9-letter word to solve the puzzle. Press Play to begin.</p>
            )
    );

    const getCellClass = (i: number, j: number, conundrum: Conundrum) : string => {
        const colourClass = previousGuesses.length === i ? 
            "blank" : 
            previousGuessesColours[i] ? 
                (difficulty === 'easy' ? 
                    previousGuessesColours[i][j] : 
                    (previousGuesses[i] === conundrum.answer ? 'blue' : 'grey')
                ) : "blank";
        const filledClass = previousGuesses.length === i && currentAnswer[j] ? "countdown-square-filled" : "";
        const animateClass = gameState === 'finished' ? "" : (colourClass.includes("blue") ? "countdown-square-correct" : "");
        return `countdown-square countdown-${colourClass} ${filledClass} ${animateClass}`;
    }

    const conundrumIndex = useMemo(() => getConundrumIndex(), []);
    const dayNode = useMemo(() => getDate(), []);

    return (
        <GameProvider context={{
            gameState,
            showPanel,
            difficulty,
            gameWon,
            gameLost,
            setGameState,
            setShowPanel
        }}>
            <GameContainer
                menuColour="var(--winterblue-pale)"
                gameColour="var(--winterwhite)"
                onGameStart={handleGameStart}
                onGameWon={handleGameWon}
                onGameLost={handleGameLost}
                onGameReset={() => {}}>
                    <GameNavbar solidBg={showPanel !== 'menu'} enabled={!(statPanelControls.isOpen || helpPanelControls.isOpen)}>
                        {showPanel === 'game' && <>
                            <ToggleButton 
                                    enabled={previousGuesses.length === 0}
                                    onClick={handleChangeDifficulty} 
                                    onLabel="NORMAL" 
                                        offLabel="EASY" 
                                    offClass="countdown-text-amber"
                                    onClass="countdown-text-blue"
                                    initialValue={difficulty === 'normal'}
                                    />
                            <GameDisclosure 
                            button={<Icon iconName="stats" iconProps={{...GAME_NAVBAR_ICON_DIM}}/>} 
                            bg="var(--winterwhite)" 
                            fullscreen
                            {...statPanelControls} >
                                <div className={`countdown-stats`}>
                                    <h2>Statistics</h2>
                                    <StatisticsNumbers stats={
                                        [
                                            {title: "Played", value: statistics.played},
                                            {title: "Win %", value: Math.floor(100 * statistics.won / statistics.played) || 0},
                                            {title: "Current Streak", value: streak},
                                            {title: "Max Streak", value: statistics.maxStreak}
                                        ]
                                    } hr={false}/>
                                    <StatisticsBarChart 
                                        title="GUESS DISTRIBUTION"
                                        highlight={gameLost ? undefined : previousGuesses.length.toString()}
                                        highlightColour="var(--winterblue)"
                                        stats={barStatistics}
                                    />
                                </div>
                            </GameDisclosure>
                            <GameDisclosure button={<Icon iconName="help" iconProps={{...GAME_NAVBAR_ICON_DIM}}/>} bg="var(--winterwhite)" {...helpPanelControls} >
                                <div className={`countdown-help`}>
                                    <h2>How to Play</h2>
                                    <p>Find the nine letter word hidden in the conundrum.</p>
                                    <ul>
                                        <li>Your guess must be a valid 9-letter word (in the Oxford Dictionary).</li>
                                        <li>You can make five guesses on each Conundrum. A new Conundrum is released daily at midnight.</li>
                                        <li>If on <b>Easy mode</b>, the colour of the tiles will change to show how close your guess was to the word.</li>
                                    </ul>
                                    <h3>Examples</h3>
                                    <CountdownRow text="HINDRANCE" colour="var(--winterblue)" index={0} />
                                    <p><b>H</b> is in the correct place.</p>
                                    <CountdownRow text="FORECOURT" colour="var(--winteramber)" index={4} />
                                    <p><b>C</b> is in the word but in the wrong spot.</p>
                                    <CountdownRow text="CROISSANT" colour="var(--wintergrey)" index={7} />
                                    <p><b>N</b> is not in the word.</p>
                                </div>
                            </GameDisclosure>
                        </>}
                    </GameNavbar>
                    {showPanel === "menu" && 
                        <GameMenu buttonText={(gameWon || gameLost) ? "See Stats" : "Play"} buttonOrder={2} menuOffset={menuOffset}>
                            <AnimContainer key={0} order={0} delay={150} offset={menuOffset} open={gameState === 'menu'} close={gameState !== 'menu'}>
                                <h2>Conundrum</h2>
                            </AnimContainer>
                            <AnimContainer key={1} order={1} delay={150} offset={menuOffset} open={gameState === 'menu'} close={gameState !== 'menu'}>
                                {menuText}
                            </AnimContainer>
                            <AnimContainer key={3} order={3} delay={150} offset={menuOffset} open={gameState === 'menu'} close={gameState !== 'menu'}>
                                <p> {dayNode} <br /> Conundrum #{conundrumIndex} by Edward Faull</p>
                            </AnimContainer>
                        </GameMenu>
                    }
                    {showPanel === "game" && conundrum && 
                        <div className={`countdown-game-wrapper`} style={{animationDelay: "2000ms"}}>
                            <div className="countdown-game">
                                <div className="countdown-prompt-table">
                                    <div className="countdown-row">
                                        {
                                            [...Array(9).keys()].map(
                                                (i) => 
                                                <div key={"prompt-cell-"+i} className="countdown-square countdown-square-prompt" style={{animationDelay: `${i * 100}ms`}}> 
                                                    <p className="countdown-text countdown-text-white atkinson-hyperlegible-mono">{conundrum.prompt[i].toUpperCase()}</p> 
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                                <hr className="countdown-hr" />
                                <div className="countdown-answer-table">
                                    {
                                        [...Array(MAX_GUESSES).keys()].map(
                                            (i) => <div key={'answer-row-'+i} className={`countdown-row ${guessInvalid && i == previousGuesses.length ? "countdown-row-incorrect" : ""}`}>
                                            {
                                                [...Array(9).keys()].map(
                                                    (j) =>  
                                                    <div key={"answer-cell-"+j} 
                                                    className={getCellClass(i, j, conundrum)}
                                                    style={previousGuessesColours[i] ? {animationDelay: `${j * 100}ms`, transitionDelay: `${j * 100 + 500}ms`} : {}}> 
                                                        {
                                                            previousGuesses.length === i ?
                                                            <p className="atkinson-hyperlegible-mono countdown-text countdown-text-grey">{currentAnswer[j] && currentAnswer[j].toUpperCase()}</p>
                                                                :
                                                            <p 
                                                                className="atkinson-hyperlegible-mono countdown-text countdown-answer-text-white"
                                                                style={{animationDelay: `${j * 100}ms`, transitionDelay: `${j * 100 + 500}ms`}}
                                                                >
                                                                    {previousGuesses[i] && previousGuesses[i][j].toUpperCase()}
                                                            </p>
                                                        }
                                                    </div>
                                                )
                                            }
                                        </div>
                                        )
                                    }
                                </div>
                                {
                                    gameLost && <div className="countdown-fail-container">
                                        <hr className="countdown-hr" />
                                        <div className="countdown-answer-table">
                                            <div className="countdown-row">
                                                {
                                                    [...Array(9).keys()].map(
                                                        (i) => 
                                                        <div key={"prompt-cell-"+i} className="countdown-square countdown-square-prompt" style={{animationDelay: `${i * 100 + 1000}ms`}}> 
                                                            <p className="countdown-text countdown-text-white atkinson-hyperlegible-mono">{conundrum.answer[i].toUpperCase()}</p> 
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                }
                                {
                                    isMobile ? 
                                        (<MobileKeyboard onClick={handleMobileKeyPress}/>) :
                                        (<div className="countdown-buttons-container">
                                            <button
                                                onClick={handleDeleteButton}
                                                className="countdown-delete-button atkinson-hyperlegible-mono countdown-text countdown-text-med countdown-text-white">
                                                    <Icon iconName="delete" iconProps={{width: "50px", height: "50px"}} pathProps={{stroke: "rgb(255, 255, 255)", fill: "rgb(255, 255, 255)"}}/>
                                            </button>
                                            <button 
                                                onClick={handleSubmitButton}
                                                className="countdown-enter-button atkinson-hyperlegible-mono countdown-text countdown-text-med countdown-text-white">
                                                    ENTER
                                            </button>
                                        </div>)
                                }
                            </div>
                        </div>
                    }
            </GameContainer>
        </GameProvider>
        
    );
}

export default withCookies(CountdownGameRedesign);