import { Conundrum, ConundrumData } from "@/types";
import Conundrums from "./conundrums-sample.json";
import PossibleWords from "./word-possible.json";
import { Cookies } from "react-cookie";

const START_DATE = new Date(2025, 1, 4);
export const MILLIS_IN_A_DAY = 86400000;


export function getConundrumIndex(): number {
    const date = Date.now()
    const index = Math.floor((date - START_DATE.getTime()) / MILLIS_IN_A_DAY);
    return index;
}

export function selectConundrum() : Conundrum {
    const index = getConundrumIndex();
    const data = readData();
    const dataToday: ConundrumData = data[index];
    const conundrumToday: Conundrum = { 
        answer: dataToday.conundrum,
        prompt: dataToday.flip ? (dataToday.antiWord + dataToday.word) : (dataToday.word + dataToday.antiWord)
    };
    return conundrumToday
}

function readData(): ConundrumData[] {
    return Conundrums['conundrums'];
}


function compareDates(d1: Date, d2: Date): boolean {
    return d1.getDate() == d2.getDate() && d1.getMonth() == d2.getMonth() && d1.getFullYear() == d2.getFullYear()
}

export function isGuessValid(guess: string): boolean {
    return PossibleWords["possibleWords"].includes(guess);
}

export function checkAnswer(guess: string, conundrum: Conundrum, cookies: Cookies): boolean {
    const correct = guess === conundrum.answer;
    if(correct){
        const COOKIE_EXPIRY = (Date.now() + MILLIS_IN_A_DAY * 180) / 1000;
        const settings = {maxAge: COOKIE_EXPIRY};

        const streak: number = cookies.get('conundrum-streak');
        const lastCompleted = new Date(cookies.get('conundrum-last-completed')?.replace('%3A', ":"));

        if(streak && lastCompleted){
            const yesterday = new Date(Date.now() - MILLIS_IN_A_DAY);
            if(compareDates(yesterday, lastCompleted)){
                cookies.set('conundrum-streak', streak + 1, settings);
            }
            else{
                cookies.set('conundrum-streak', 1, settings);
            }
        }
        else{
            cookies.set('conundrum-streak', 1, settings);
        }
        const today = new Date();
        cookies.set('conundrum-last-completed', today.toISOString(), settings);
        
        return true;
    }
    return false;
}

export function addToList(guess: string, previousGuesses: string[], cookies: Cookies) : string[] {
    const newGuesses = previousGuesses.concat(guess);
    const maxAge = new Date().setHours(24, 0, 0, 0) - Date.now();
    cookies.set('conundrum-guesses', newGuesses.join(','), {maxAge: maxAge / 1000});
    return newGuesses;
}

export function getStreak(cookies: Cookies): number{
    const lastCompleted = new Date(cookies.get('conundrum-last-completed')?.replace('%3A', ":"));
    const yesterday = new Date(Date.now() - MILLIS_IN_A_DAY);
    const today = new Date();
    if(compareDates(lastCompleted, yesterday) || compareDates(lastCompleted, today)){
        const streak = cookies.get('conundrum-streak');
        return streak ? streak : 0;
    }
    const COOKIE_EXPIRY = (Date.now() + MILLIS_IN_A_DAY * 180) / 1000;
    const settings = {maxAge: COOKIE_EXPIRY};
    cookies.set("conundrum-streak", 0, settings);
    return 0;
}

export function resetStreak(cookies: Cookies): void{
    cookies.remove('conundrum-streak');
}

export function checkCompleted(cookies: Cookies, previousGuesses: string[]): boolean{
    const lastCompleted = new Date(cookies.get('conundrum-last-completed')?.replace('%3A', ":"));
    if(new Date().toDateString() == lastCompleted.toDateString()){
        return true;
    }
    const isGameOver = previousGuesses && previousGuesses.length >= 6;
    return isGameOver;
}