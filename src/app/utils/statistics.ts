import { StatisticsBarChartData } from "@/components/StatisticsBarChart/StatisticsBarChart";

const getItem = (key: string) : number => {
    return JSON.parse(localStorage.getItem(key) || "0");
}

const setItem = (key: string, value: number) => {
    localStorage.setItem(key, JSON.stringify(value));
}

export type Statistics = {
    played: number;
    won: number;
    maxStreak: number;
}

export const logStatistics = (game: string, isGameWon: boolean, streak: number = 0) => {

    setItem(`${game}-played`, getItem(`${game}-played`) + 1);

    if(isGameWon){
        setItem(`${game}-won`, getItem(`${game}-won`) + 1);
        const maxStreak = getItem(`${game}-max-streak`);
        if(streak > maxStreak){
            setItem(`${game}-max-streak`, streak);
        }
    }
    else{
        setItem(`${game}-streak`, 0);
    }
}

export const logExtraStat = (game: string, key: string) => {
    setItem(`${game}-${key}`, getItem(`${game}-${key}`) + 1);
}

export const getStatistics = (game: string) : Statistics => {
    return {
        played: getItem(`${game}-played`),
        won: getItem(`${game}-won`),
        maxStreak: getItem(`${game}-max-streak`)
    };
}

export const getBarChartStatistics = (key: string, bins: string[]) : StatisticsBarChartData => {
    const values : number[] = [];
    for(let i = 0; i < bins.length; i++){
        values.push(getItem(`${key}-${bins[i]}`))
    }
    return bins.map((x, i) => { return {bin: x, value: values[i]}});
}